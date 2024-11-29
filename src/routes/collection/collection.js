import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";

class CollectionAPI {
  /**
   * Retrieves all documents from a specified Firestore collection
   *
   * @param String colName - The name of the Firestore collection to query
   * @param String pageSize - The limit for the number of pages
   * @param String startAfterDocument - Document reference for cursor pagination
   * @param String filters - filters object
   *
   * @returns Array
   */
  getCollection = async (colName, pageSize = 15, filters = {}) => {
    try {
      let queryRef = collection(db, colName);

      queryRef = query(queryRef, orderBy("course_name"), orderBy("section"));

      if (filters?.instructor) {
        queryRef = query(
          queryRef,
          where("instructor", "==", filters.instructor)
        );
      }
      if (filters?.query) {
        queryRef = query(queryRef, where("course_name", "==", filters.query));
      }
      if (filters?.days) {
        queryRef = query(queryRef, where("days", "==", filters.days));
      }
      if (filters?.section) {
        queryRef = query(queryRef, where("section", "==", filters.section));
      }
      if (filters?.startTime) {
        queryRef = query(
          queryRef,
          where("start_time", "==", filters.startTime)
        );
      }

      if (filters?.endTime) {
        queryRef = query(queryRef, where("end_time", "==", filters.endTime));
      }
      if (filters?.showAvail == true) {
        queryRef = query(queryRef, where("seats", ">=", "1"));
      }

      if (filters?.lastVisible) {
        queryRef = query(queryRef, startAfter(filters.lastVisible));
      }

      queryRef = query(queryRef, limit(pageSize));

      const querySnapshot = await getDocs(queryRef);

      const docsArray = [];

      querySnapshot.forEach((doc) => {
        docsArray.push({
          data: { id: doc.id, ...doc.data() },
          snapshot: doc,
        });
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { docsArray, lastVisible };
    } catch (error) {
      console.error("Error fetching collection:", error);
      return { docsArray: [], lastVisible: null };
    }
  };

  getUniqueTimesFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));

      const uniqueStartTimes = new Set();
      const uniqueEndTimes = new Set();

      querySnapshot.forEach((doc) => {
        const course = doc.data();
        if (course.start_time) uniqueStartTimes.add(course.start_time);
        if (course.end_time) uniqueEndTimes.add(course.end_time);
      });

      const startTimes = [...uniqueStartTimes];
      const endTimes = [...uniqueEndTimes];

      startTimes.sort((a, b) => {
        return a.localeCompare(b);
      });

      endTimes.sort((a, b) => {
        return a.localeCompare(b);
      });

      return { startTimes, endTimes };
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  /**
   * Retrieves a specific document via document ID from a specified Firestore collection
   *
   * @param String colName - The name of the Firestore collection to query
   * @param String docID - The id of the Firestore document
   *
   * @returns Object
   */
  getDoc = async (colName, docID) => {
    const docRef = doc(db, colName, docID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  /**
   * Syncs course data to the courses collection in firebase with semester and year included
   *
   * @param Array courses - The course objects to be updated or created
   * @param String semester - The semester identifier (e.g., "Fall", "Spring")
   * @param String year - The academic year (e.g., "2024-25")
   *
   */
  syncDataToFirebase = async function (courses, semester, year) {
    if (courses) {
      for (const [courseName, sections] of Object.entries(courses)) {
        const courseRef = collection(db, "courses");

        for (const section of sections) {
          // Create a unique ID based on course name, section, days, semester, and year
          const sectionId = `${courseName}-${section.Section}-${section.Days}-${semester}-${year}`;

          // Create a reference to the document
          const sectionRef = doc(courseRef, sectionId);

          // Set the document (this will update if it exists or create if it doesn't)
          await setDoc(
            sectionRef,
            {
              course_name: courseName,
              section: section.Section || "",
              seats: section.Seats || "",
              days: section.Days || "",
              instructor: section.Instructor || "",
              start_time: section.StartTime || "",
              end_time: section.EndTime || "",
              building: section.Building || "",
              semester: semester || "Unknown",
              year: year || "Unknown",
            },
            { merge: true }
          );
        }
      }
    }
  };
}

export const collectionAPI = new CollectionAPI();
