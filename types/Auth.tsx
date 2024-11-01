import {
  auth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "@/firebase/Firebase";
import FirestoreCtrl, { DBUser } from "@/firebase/FirestoreCtrl";

/*** 
 * Function to check if the email is valid
 * @param email - email to be checked
 * @returns - true if the email is valid, false otherwise
 */
export function isValidEmail(email : string) {
  let reg = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  return reg.test(email);
}

export const logInWithGoogle = (
  credential: any,
  router: any,
  firestoreCtrl: FirestoreCtrl
) => {
  signInWithCredential(auth, credential).then((result) => {
    const newUser =
      result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
    if (newUser) {
      const userData: DBUser = {
        name: result.user.displayName || "",
        email: result.user.email || "",
        createdAt: new Date(),
      };

      firestoreCtrl.createUser(result.user.uid, userData).then(() => {
        router.navigate("@app/home/PLACEHOLd_home_screen");
      });
    } else {
      firestoreCtrl
        .getUser(result.user.uid)
        .then((user: any) => {
          if ( user ) {
            router.navigate("@app/home/PLACEHOLd_home_screen");
          }
        })
        .catch(() => {
          // User might not exist in the database
          firestoreCtrl
            .createUser(result.user.uid, {
              name: result.user.displayName || "",
              email: result.user.email || "",
              createdAt: new Date(),
            })
            .then(() => {
              router.navigate("@app/home/PLACEHOLd_home_screen");
            });
        });
    }
  });
};

export const logInWithEmail = async (
  email: string,
  password: string,
  firestoreCtrl: FirestoreCtrl,
  router: any,
) => {
  if (email && password) {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user) {
        const user = await firestoreCtrl
          .getUser(response.user.uid)
          .catch(() => {
            // User might not exist in the database
            firestoreCtrl
              .createUser(response.user.uid, {
                name: response.user.displayName || "",
                email: response.user.email || "",
                createdAt: new Date(),
              })
              .then(() => {
                router.navigate("@app/home/PLACEHOLd_home_screen");
              });
          });
        if ( user ) {
          router.navigate("@app/home/PLACEHOLd_home_screen");
        }
      } else {
        console.log("Invalid credentials");
      }
    } catch (e) {
      console.log("Login failed. Please check your credentials.");
    }
  }
};

export const signUpWithEmail = async (
  userName: string,
  email: string,
  password: string,
  firestoreCtrl: FirestoreCtrl,
  router: any,
) => {
  if (userName && email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userData: DBUser = {
          name: userName,
          email: email,
          createdAt: new Date(),
        };

        console.log("User INFO \n", userCredential.user.uid, userData);
        firestoreCtrl
          .createUser(userCredential.user.uid, userData)
          .then(() => {
            router.navigate("../home/home_screen");
          })
          .catch((error) => {
            console.log("FirestoreCtrl failed to create user due to following error \n", error);
          });
      })
      .catch((error) => {
        console.log("Sign Up failed. Please check your credentials.", error);
      });
  } else {
    console.log("Please input email and password.");
  }
};

