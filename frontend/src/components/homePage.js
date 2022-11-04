import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import List from "./list.js";
import Loading from "./loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import AuthNav from "./auth-nav";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [delay, setDelay] = useState("");
  const [remove, setRemove] = useState(false);

  const { user } = useAuth0();
  const { sub } = user;

  const todayDate = new Date().getTime();

  const compare = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  const getData = async () => {
    const resp = await fetch("/api");
    const data = await resp.json();
    const filteredData = data.data.filter((item) => {
      return item.user_id === sub;
    });
    const sortedData = filteredData.sort(compare);
    setProducts(sortedData);
  };

  useEffect(() => {
    getData();
  }, [remove]);

  const handleSubmit = (e) => {
    fetch("/addProduct", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ name: name, delay: delay, user_id: sub }),
    });
  };

  const handleRemove = (id) => {
    fetch("/removeProduct", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    setRemove(!remove);
  };

  return (
    <>
      <Container>
        <Container>
          <Navbar>
            <Navbar.Brand>Buy Delay</Navbar.Brand>
            <AuthNav></AuthNav>
          </Navbar>
          <h3>Add item</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="fromBasicName">
              <Form.Label>Product: </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Text className="text-muted">
                The product you want to put on the list.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="fromBasicDelay">
              <Form.Label>Delay: </Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Days"
                name="delay"
                value={delay}
                onChange={(e) => setDelay(e.target.value)}
              />
              <Form.Text className="text-muted">
                The delay you want to set in days.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Container>
        <hr></hr>
        <Accordion className="mb-3" defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Ready</Accordion.Header>
            <Accordion.Body>
              {!products
                ? "Loading..."
                : products.map((item) => {
                    const { id, delay, date } = item;
                    const targetDate = (
                      parseInt(date) +
                      delay * 86400000
                    ).toString();
                    if (todayDate >= targetDate) {
                      return (
                        <List
                          key={id}
                          item={item}
                          handleRemove={handleRemove}
                          readyType="primary"
                          todayDate={todayDate}
                          targetDate={targetDate}
                        />
                      );
                    }
                    return "";
                  })}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Not Ready</Accordion.Header>
            <Accordion.Body>
              {!products
                ? "Loading..."
                : products.map((item) => {
                    const { id, delay, date } = item;
                    const targetDate = (
                      parseInt(date) +
                      delay * 86400000
                    ).toString();
                    if (todayDate < targetDate) {
                      return (
                        <List
                          key={id}
                          item={item}
                          handleRemove={handleRemove}
                          readyType="secondary"
                          todayDate={todayDate}
                          targetDate={targetDate}
                        />
                      );
                    }
                    return "";
                  })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  );
};

export default withAuthenticationRequired(HomePage, {
  onRedirecting: () => <Loading />,
});
