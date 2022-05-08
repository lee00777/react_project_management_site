import React, { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { signup, isPending, error } = useSignup();

  function handleFileChange(ev) {
    setThumbnail(null); // 이미 선택해놓고 다른 이미지 새롭게 선택할때 등을 대비해서, null로 초기화하고 시작하기
    let selected = ev.target.files[0]; // "ev.target.files" returns an array by default for the case allowing multiple files for users, but here we are not going to allow selecting multiple files. Therefore just use [0].
    console.log("selected file : ", selected);

    // .name, .size, .type 이용해서 사진파일 format만 allow하고, 사이즈 제한하기
    if (!selected) {
      setThumbnailError("Please select a file");
      return;
    }
    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }
    if (selected.size > 100000) {
      setThumbnailError("Image file size must be less than 100kb");
      return;
    }
    setThumbnailError(null);
    setThumbnail(selected);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    signup(email, password, displayName, thumbnail);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        <span>Email : </span>
        <input
          type="email"
          required
          value={email}
          onChange={(ev) => {
            setEmail(ev.target.value);
          }}
        />
      </label>
      <label>
        <span>Password : </span>
        <input
          type="password"
          required
          value={password}
          onChange={(ev) => {
            setPassword(ev.target.value);
          }}
        />
      </label>
      <label>
        <span>Display name : </span>
        <input
          type="text"
          required
          value={displayName}
          onChange={(ev) => {
            setDisplayName(ev.target.value);
          }}
        />
      </label>
      <label>
        <span>Profile thumbnail : </span>
        <input type="file" required onChange={handleFileChange} />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {!isPending && (
        <div className="sign-up">
          <button className="btn">Sign up</button>
        </div>
      )}
      {isPending && (
        <div className="sign-up">
          <button className="btn" disabled>
            Loading...
          </button>
        </div>
      )}
      {/* {error && <div className="error"> {error} </div>} */}
    </form>
  );
}
