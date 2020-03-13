// vendor
import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DragDropContext } from "react-beautiful-dnd";
import { FiSettings } from "react-icons/fi";
import moment from "moment";
import PouchDB from "pouchdb-browser";

// custom
import List from "../Components/List";
import Settings from "../Components/Settings";
import { move, reorder, sortItems } from "../lib/general";

var itemsDb = new PouchDB("items");
var settingsDb = new PouchDB("settings");

itemsDb.sync("http://localhost:5984/items", { live: true, retry: true });
settingsDb.sync("http://localhost:5984/settings", { live: true, retry: true });

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: null,
      items: null,
      menuOpen: false,
      loading: false,
    };

    this.settingsCanceler = null;
    this.itemsCanceler = null;
  }

  componentWillMount() {
    this.fetchData();
    this.itemsCanceler = itemsDb
      .changes({
        since: "now",
        live: true,
        include_docs: true,
      })
      .on("change", () => this.fetchData());
    this.settingsCanceler = settingsDb
      .changes({
        since: "now",
        live: true,
        include_docs: true,
      })
      .on("change", () => this.fetchData());
  }

  fetchData = async () => {
    this.setState({ loading: true, items: null, settings: null });

    let items = [];
    let settings = [];
    await itemsDb
      .allDocs({ include_docs: true })
      .then(result => {
        items = result.rows;
      })
      .catch(err => {
        console.log(err);
      });

    await settingsDb
      .allDocs({ include_docs: true })
      .then(result => {
        settings = result.rows[0];
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({ items, settings, loading: false });
  };
  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    // dropped into reminders
    if (
      destination.droppableId === "reminders" &&
      source.droppableId !== destination.droppableId
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const yeah = [...this.state.items[source.droppableId]];
      const items = reorder(yeah, source.index, destination.index);

      this.setState({ [source.droppableId]: items });
    } else {
      const result = move(
        this.state[source.droppableId],
        this.state[destination.droppableId],
        source,
        destination,
      );

      this.setState({
        [source.droppableId]: result[source.droppableId],
        [destination.droppableId]: result[destination.droppableId],
      });
    }
  };

  toggleMenuOpen = () => this.setState({ menuOpen: !this.state.menuOpen });

  updateListItem = (doc, key, value) => {
    doc[key] = value;
    itemsDb.put(doc);
  };

  updateSetting = (doc, key, value) => {
    doc[key] = value;
    settingsDb.put(doc);
  };

  render() {
    const { menuOpen, items, settings, loading } = this.state;
    const { deleteItem, updateListItem, toggleMenuOpen, updateSetting } = this;

    if (loading) return <div />;

    const sortedItems = sortItems(items);

    const lists = [
      {
        settings: settings.doc.todos,
        items: sortedItems.filter(itm => itm.doc.list === "todos"),
      },
      {
        settings: settings.doc.reminders,
        items: sortedItems.filter(itm => itm.doc.list === "reminders"),
      },
      {
        settings: settings.doc.backlog,
        items: sortedItems.filter(itm => itm.doc.list === "backlog"),
      },
    ];

    return (
      <Container>
        <Row>
          <Col className="text-right mr-2">
            <h1 className="text-secondary mt-5">
              My {settings.doc.cadence}{" "}
              <span
                style={{
                  color: "darkgray",
                  cursor: "pointer",
                  verticalAlign: "top",
                }}
                onClick={toggleMenuOpen}
              >
                <FiSettings
                  size={".85em"}
                  className="mt-2 ml-1"
                  style={{ verticalAlign: "top" }}
                />
              </span>
            </h1>
            <h5 className="mr-5" style={{ color: "darkGray" }}>
              {moment(settings.startDate).format("MMM D")} -{" "}
              {moment(settings.endDate).format("MMM D")}
            </h5>
          </Col>
          <Col>
            <br />
            <DragDropContext onDragEnd={this.onDragEnd}>
              {lists.map((list, i) => {
                return (
                  <List
                    key={i}
                    items={list.items}
                    itemsDb={itemsDb}
                    settings={list.settings}
                    deleteItem={deleteItem}
                    updateListItem={updateListItem}
                  />
                );
              })}
            </DragDropContext>
          </Col>
          <Col className="text-left">
            <Settings
              settings={settings.doc}
              updateSetting={updateSetting}
              isMenuOpen={menuOpen}
              toggleMenuOpen={toggleMenuOpen}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
