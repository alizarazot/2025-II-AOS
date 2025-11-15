import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { collection, doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../../firebase.js";

const userCollection = collection(db, "users");

export async function needsMissingPage() {
  if (auth.currentUser == null) {
    return null;
  }

  const data = (await getDoc(doc(userCollection, auth.currentUser.uid))).data();

  if (data == null) return true;

  if (data.sex == null || data.nationality == null) {
    return true;
  }

  return false;
}

export function MissingPage() {
  const navigate = useNavigate();

  needsMissingPage().then((needsMissing) => {
    if (needsMissing === null) {
      useEffect((_) => {
        console.error(
          "Unreachable code reached! The user must be always logged in at this point!",
        );
        navigate("/login");
      });
    }

    if (!needsMissing) {
      console.log("User data is OK.");
      navigate("/");
    }
  });

  const [dbMissingSex, setDbMissingSex] = useState(false);
  const [dbMissingNationality, setDbMissingNationality] = useState(false);

  useEffect(
    (_) => {
      getDoc(doc(userCollection, auth.currentUser.uid))
        .then((doc) => doc.data())
        .then((data) => {
          if (data == null) {
            setDbMissingSex(true);
            setDbMissingNationality(true);
            return;
          }

          if (data.sex == null) {
            setDbMissingSex(true);
          }

          if (data.nationality == null) {
            setDbMissingNationality(true);
          }
        });
    },
    [dbMissingSex, dbMissingNationality],
  );

  const [formSex, setFormSex] = useState("");
  const [formNationality, setFormNationality] = useState("");

  return (
    <div>
      <h1> Tell us more about yourself. </h1>
      <Form
        action={async (e) => {
          if (dbMissingSex && formSex == "") {
            console.error("Invalid sex.");
          }

          if (dbMissingNationality && formNationality.trim() == "") {
            console.error("Invalid nationality");
          }

          const data = {};

          if (dbMissingSex) {
            data.sex = formSex;
          }

          if (dbMissingNationality) {
            data.nationality = formNationality;
          }

          await setDoc(doc(userCollection, auth.currentUser.uid), data, {
            merge: true,
          });
        }}
      >
        {dbMissingSex && (
          <Form.Group>
            <Form.Label> What's your sex? </Form.Label>
            <div>
              {["Male", "Female", "Other"].map((type) => (
                <Form.Check
                  key={type}
                  id={type}
                  onChange={(e) => {
                    setFormSex(e.target.value);
                  }}
                  value={type}
                  name="sex"
                  inline
                  type="radio"
                  label={type}
                />
              ))}
            </div>
          </Form.Group>
        )}
        {dbMissingNationality && (
          <Form.Group className="d-flex flex-column">
            <Form.Label> What's your nationality? </Form.Label>
            <input
              name="nationality"
              onChange={(e) => {
                setFormNationality(e.target.value);
              }}
            />
          </Form.Group>
        )}

        <Button type="submit"> Done! </Button>
      </Form>
    </div>
  );
}
