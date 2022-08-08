import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Empty, Pagination, Typography, notification } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "./DiscoverPosters.css";

const DiscoverPosters = (props) => {
  const [isSuccessfulRequest, setSuccessfulRequest] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    const options = {
      method: "GET",
      url: `${process.env.REACT_APP_REQUEST_ROOT}/.netlify/functions/api/discover/posters`,
      params: {
        query: props.query,
        language: props.language,
        minimumPopularity: props.minimumPopularity,
        page: page,
      },
    };

    axios
      .request(options)
      .then((res) => {
        console.log(res);
        setResults(res.data.results);
        setTotalPages(res.data.total_pages);
        setSuccessfulRequest(true);
      })
      .catch((err) => {
        notification.error({
          message: `Error ${err.response.status}`,
          description: (
            <>
              {err.message} <br /> {err.response.data}
            </>
          ),
        });
        console.log(err);
        setSuccessfulRequest(false);
      });
  }, [props.query, props.language, props.minimumPopularity, page]);

  useEffect(() => {
    setPage(1);
  }, [props.query]);

  if (!isSuccessfulRequest || results.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1 }}
      >
        <Empty style={{ margin: "20px 0" }} />
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="discover-posters-top-level-container"
    >
      <div className="discover-posters-container">
        {results.map((result) => {
          if (result.release_date === "" || result.poster_path === null)
            return null;
          return (
            <Link to={`/discover/${result.id}/${props.language}`}>
              <div className="discover-posters-wrapper">
                <img
                  className="discover-poster"
                  src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
                  alt="poster"
                />
                <Typography className="discover-poster-content discover-poster-fade">
                  Preview <EyeOutlined />
                </Typography>
              </div>
            </Link>
          );
        })}
      </div>
      <Pagination
        defaultCurrent={1}
        total={totalPages}
        showSizeChanger={false}
        pageSize="1"
        current={page}
        style={{ margin: "20px 0", textAlign: "center" }}
        onChange={(value) => {
          setPage(value);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      />
    </motion.div>
  );
};

export default DiscoverPosters;
