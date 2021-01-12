import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
let timer = null;

const Nav = styled.nav`
  background: #ff0110;
  padding: 5px;
  text-align: center;
`;

const Search = styled.input.attrs({
  type: "search"
})`
  background: transparent;
  border: 0;
  color: #fff;
  border-bottom: 2px solid #fff;
`;

const Button = styled.button`
  background: transparent;
  border: 0;
  color: #fff;
`;

export const getVideo = (word, limit, ref = "") => {
  return (dispatch) => {
    dispatch({ type: "LOADING", payload: { loading: true } });

    const key = "YOUR_API_KEY";
    return fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${word}&key=${key}&maxResults=${limit}`
    )
      .then((res) => res.json())
      .then((json) => {
        dispatch({ type: "LOADING", payload: { loading: false } });
        if (!word) return;
        if (ref && ref.current.value !== word) return;

        dispatch({
          type: "UPDATE",
          payload: {
            items: {
              [word]: { items: json.items, nextPageToken: json.nextPageToken }
            },
            current: word
          }
        });
      });
  };
};

export default () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => ({
    items: state.items
  }));
  const [data, setData] = useState("");
  const inputEl = useRef(null);
  const search = (word) => {
    return (dispatch) => {
      if (word in items) {
        dispatch({
          type: "GET",
          payload: {
            current: word
          }
        });
        return;
      }

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        dispatch(getVideo(word, 30, inputEl));
      }, 1000);
    };
  };

  return (
    <Nav>
      <Search
        ref={inputEl}
        value={data}
        onChange={(e) => setData(e.target.value)}
        onInput={(e) => dispatch(search(e.target.value))}
      />
      <Button onClick={() => dispatch(search(data))}>search</Button>
    </Nav>
  );
};
