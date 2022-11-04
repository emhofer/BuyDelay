import React from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const List = ({ item, handleRemove, readyType, todayDate, targetDate }) => {
  const { id, name } = item;
  const daysLeft = Math.floor((targetDate - todayDate) / 86400000);
  return (
    <>
      <Row
        className={
          "mb-1 border bg-" + readyType + " rounded p-1 border-" + readyType
        }
      >
        <Col className="d-flex align-items-center justify-content-center text-capitalize text-light">
          {name}
        </Col>
        <Col className="d-flex align-items-center justify-content-center text-light">
          {daysLeft >= 0
            ? `${daysLeft} days left`
            : `+${-daysLeft} days`}
        </Col>
        <Col className="d-flex align-items-center justify-content-center text-capitalize">
          <Button
            className=""
            variant={"outline-light"}
            onClick={() => handleRemove(id)}
          >
            remove
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default List;
