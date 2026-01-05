import React, { createContext, useState, useEffect, useContext, useRef, useMemo } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useLocalState } from "../hooks/useLocalState";
import { useToast } from "./ToastContext";
import { todayStr, yesterdayStr, round2, fmt } from "../utils/format";

export const UserContext = createContext(null);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
}

const INITIAL_USER_STATE = {
    username: null,
    balance: 10000,
    lastLogin: null,
    streak: 0,
    loginDates: [],
    readArticles: {},
    investments: [],
    transactions: [],
    careerLevel: 1,
    careerProgress: {},
    unlockedTools: [], // Tools unlock after levels
    habitStats: {
        savings: { score: 1, note: "" },
        spending: { score: 1, note: "" },
        investing: { score: 1, note: "" },
    },
    mode: "career", // 'career' | 'financial_tools'
};

export function UserProvider({ children }) {
    const [user, setUser] = useLocalState("fintwitch_user", INITIAL_USER_STATE);
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { push } = useToast();

    // Use a Ref to keep track of the latest user state without triggering effect re-runs
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    const isFetching = useRef(false);

    // Highly stable profile fetcher (Internal only) with Timeout
    const fetchProfile = async (uid, email) => {
        if (isFetching.current) return;
        isFetching.current = true;

        try {
            console.log("[UserContext] Initializing profile for:", email);
            const docRef = doc(db, "users", uid);

            // Race condition: Firestore fetch vs 3s Timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Firestore timeout")), 4000)
            );

            const snap = await Promise.race([
                getDoc(docRef),
                timeoutPromise
            ]);

            if (snap.exists()) {
                const data = snap.data();
                setUser(prev => ({ ...prev, ...data }));
            } else {
                // New user flow
                const fallbackName = email?.split('@')[0] || "Trader";
                const initialData = {
                    ...userRef.current,
                    username: userRef.current.username || fallbackName,
                    balance: Math.max(userRef.current.balance || 10000, 10000)
                };
                setDoc(docRef, initialData).catch(e => console.warn("Firestore init error (offline?):", e.message));
                setUser(initialData);
            }
        } catch (err) {
            console.warn("[UserContext] Profile fetch warning:", err.message);
            // Fallback to local state if fetch fails/times out
            if (!userRef.current.username) {
                setUser(prev => ({ ...prev, username: email?.split('@')[0] || "Trader" }));
            }
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    };

    // Auth Change Listener (Stable)
    useEffect(() => {
        const safetyTimer = setTimeout(() => setIsLoading(false), 10000);

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) {
                setFirebaseUser(u);
                fetchProfile(u.uid, u.email);
            } else {
                setFirebaseUser(null);
                setIsLoading(false);
            }
            clearTimeout(safetyTimer);
        });

        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Firestore Sync Hook (Defensive)
    useEffect(() => {
        const sync = async () => {
            if (!firebaseUser || isLoading || isFetching.current) return;
            try {
                const docRef = doc(db, "users", firebaseUser.uid);
                await updateDoc(docRef, user).catch(async (err) => {
                    if (err.code === 'not-found') await setDoc(docRef, user);
                });
            } catch (e) { /* sync failure is okay */ }
        };
        const timer = setTimeout(sync, 1500); // 1.5s debounce to save writes
        return () => clearTimeout(timer);
    }, [user, firebaseUser, isLoading]);

    // Methods
    const signin = async (email, password) => {
        setIsLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await fetchProfile(result.user.uid, result.user.email);
            return true;
        } catch (error) {
            console.error("Login failed:", error.code);
            let msg = "Invalid credentials";
            if (error.code === 'auth/network-request-failed') msg = "Network error - check connection";
            push(msg, { style: "danger" });
            setIsLoading(false);
            throw error;
        }
    };

    const signup = async (email, password, username) => {
        setIsLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const initialData = { ...INITIAL_USER_STATE, username, balance: 10000 };
            const docRef = doc(db, "users", result.user.uid);
            await setDoc(docRef, initialData);
            setUser(initialData);
            setIsLoading(false);
            return true;
        } catch (error) {
            push(error.message, { style: "danger" });
            setIsLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(prev => ({ ...prev, username: null }));
            push("Signed out successfully", { style: "success" });
        } catch (e) { console.error(e); }
    };

    const resetPassword = async (email) => {
        try { await sendPasswordResetEmail(auth, email); return true; }
        catch (error) { throw error; }
    };

    const transact = (amount, { source = "system", label = null } = {}) => {
        setUser((u) => {
            const newBalance = round2(Math.max(0, u.balance + amount));
            const tx = { id: Date.now(), ts: new Date().toISOString(), amount: round2(amount), balanceAfter: newBalance, source, label };
            return { ...u, balance: newBalance, transactions: [...(u.transactions || []), tx].slice(-200) };
        });
        push(`${amount > 0 ? "+" : ""}${fmt(amount)} (${label || source})`, { style: amount >= 0 ? "success" : "danger" });
    };

    const markArticleRead = (id, reward = 10) => {
        setUser((u) => {
            if (u.readArticles?.[id]) return u;
            const newBal = round2(u.balance + reward);
            return { ...u, readArticles: { ...(u.readArticles || {}), [id]: true }, balance: newBal };
        });
        push(`Read article reward +${fmt(reward)}`, { style: "success" });
    };

    const invest = (investment) => setUser((u) => ({ ...u, investments: [...(u.investments || []), investment] }));

    const realizeInvestment = (id, multiplier) => setUser((u) => {
        const inv = (u.investments || []).find((i) => i.id === id);
        if (!inv) return u;
        const returned = round2(inv.amount * multiplier);
        const nextBalance = round2(u.balance + returned);
        push(`Investment return ${fmt(returned)}`, { style: "success" });
        return { ...u, balance: nextBalance, investments: u.investments.filter((i) => i.id !== id) };
    });

    const completeCareerLevel = (level, performance) => {
        setUser((u) => {
            const nextLevel = Math.min(6, Math.max(u.careerLevel, level + 1));
            // Roadmap: L1->Splitter, L2->Emergency, L3->EMI, L4->SIP, L5->FIRE, L6->Wealth
            const allTools = ["expense_splitter", "emergency_fund", "emi", "sip", "fire", "wealth_dashboard"];

            // Logic to unlock specific tools based on level (Strict Mapping)
            // L1 done -> Unlock Splitter (Index 0)
            // L2 done -> Unlock Emergency (Index 1)
            const toolToUnlock = allTools[level - 1];

            const currentUnlocked = new Set(u.unlockedTools || []);
            if (toolToUnlock && !currentUnlocked.has(toolToUnlock)) {
                currentUnlocked.add(toolToUnlock);
                push(`Tool unlocked: ${toolToUnlock.replace('_', ' ').toUpperCase()} 🔓`, { style: "success" });
            }

            const updatedTools = Array.from(currentUnlocked);
            const careerProgress = { ...(u.careerProgress || {}), [level]: performance };

            return { ...u, careerLevel: nextLevel, careerProgress, unlockedTools: updatedTools };
        });
    };

    const updateHabitStats = (domain, score, note) => {
        setUser((u) => ({ ...u, habitStats: { ...(u.habitStats || {}), [domain]: { score, note } } }));
    };

    // Stable Context Value
    const contextValue = useMemo(() => ({
        user, setUser,
        signin, login: signin, // Alias for compatibility
        signup, logout, resetPassword,
        transact, addBalance: transact, // Alias
        markArticleRead, invest, realizeInvestment,
        completeCareerLevel, updateHabitStats,
        isLoading, firebaseUser
    }), [user, isLoading, firebaseUser]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}
