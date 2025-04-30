import {collection, query, getDocs, doc, getDoc, where} from "firebase/firestore";
import {db} from "../firebase";

export const getAllTickets = async () => {
    try{
        const q = query(collection(db, "tasks"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return [];
    }
};

export const getOngoingTickets = async () => {
    try{
        const q = query(collection(db, "tasks"), where("Completed", "==", false));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return [];
    }
};

export const getDoneTickets = async () => {
    try{
        const q = query(collection(db, "tasks"), where("Completed", "==", true));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return [];
    }
};

export const getUsername = async (id) => {
    try{
        if (!id) return "None";

        const docRef = doc(db, "Users", id); // userID = document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return `${data.firstName} ${data.lastName}`;
        } else {
            console.warn("User not found:", id);
            return "None";
        }
    } catch (error) {
        console.log("Error fetching user:", error);
        return null;
    }
}
