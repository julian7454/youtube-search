import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { getVideo } from "./Search";
import Loading from "./Loading";

const Content = styled.main`
  padding: 0 20px;
  display: flex;
  min-height: 300px;
  justify-content: center;
  align-items: center;
`;

const List = styled.ul`
  padding-left: 0;
  display: flex;
  list-style-type: none;
  flex-wrap: wrap;
  max-width: 800px;

  li {
    padding: 5px;
    flex-basis: 250px;

    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 200px;
    }
    @media (max-width: 530px) {
      flex-basis: 45%;
      p {
        width: 150px;
      }
    }
    @media (max-width: 375px) {
      flex-basis: 80%;
      p {
        width: 300px;
      }
    }

    img {
      width: 100%;
      object-fit: cover;
    }
  }
`;

const Pager = styled.div`
  width: 100%;
  text-align: center;
`;

const Button = styled.button`
  border: none;
  background: transparent;
  color: #555;

  &.active {
    background: #ff0110;
    color: #fff;
    border-radius: 50%;
  }
`;

export default () => {
  const dispatch = useDispatch();
  const { items, current, loading } = useSelector((state) => ({
    items: state.items,
    current: state.current,
    loading: state.loading
  }));
  const nextPageToken = items[current].nextPageToken;
  const limit = 10;
  const [page, setPage] = useState(0);
  let currentPageItems =
    items[current].items?.reduce((acc, crr, i) => {
      if (!(i % limit)) {
        acc.push(items[current].items?.slice(i, i + limit));
      }
      return acc;
    }, []) || [];

  useEffect(() => {
    setPage(0);
  }, [current]);

  useEffect(() => {
    if (nextPageToken && page === currentPageItems.length - 1) {
      dispatch(getVideo(current, 10));
    }
  }, [page, nextPageToken]);

  return (
    <div>
      <Content>
        <List>
          {currentPageItems[page]?.map((item, index) => {
            return (
              <li key={index}>
                <img src={item?.snippet?.thumbnails.medium.url} />
                <p>{item?.snippet?.channelTitle}</p>
              </li>
            );
          })}
        </List>
        {!currentPageItems.length && <p>請輸入搜尋音樂名稱</p>}
      </Content>
      <Pager>
        {currentPageItems.map((item, index) => {
          return (
            <Button
              className={`${page === index ? "active" : ""}`}
              key={index}
              onClick={() => setPage(index)}
            >
              {index + 1}
            </Button>
          );
        })}
        <p>第{page + 1}頁</p>
        {loading && <Loading />}
      </Pager>
    </div>
  );
};
