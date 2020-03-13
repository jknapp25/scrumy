// vendor
import React from "react";
import { Table, Card, Button } from "react-bootstrap";
import { Droppable } from "react-beautiful-dnd";
import { IoMdAdd } from "react-icons/io";
import uuidv1 from "uuid";

// custom
import ListItem from "./ListItem";
import { getNewItemPosition } from "../lib/general";

const List = props => {
  const { deleteItem, items, updateListItem, settings, itemsDb } = props;
  const {
    canAdd,
    hasCheck,
    headerColor,
    isDropDisabled,
    name,
    title,
    visible,
  } = settings;

  const addItem = type => {
    const newItem = {
      title: "New item",
      id: uuidv1(),
      list: type,
      done: false,
      position: getNewItemPosition(type, items),
    };
    itemsDb.post(newItem);
  };

  if (!visible) return <div />;

  return (
    <Droppable droppableId={name} isDropDisabled={isDropDisabled}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <Card className="shadow-sm mb-3">
            <Card.Header
              className={`text-left bg-${headerColor} font-weight-bold`}
            >
              {title}
              {canAdd && (
                <Button
                  className="float-right p-0"
                  variant="link"
                  onClick={() => addItem(name)}
                >
                  <IoMdAdd size="1.2em" />
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0">
                <tbody>
                  {items.map((itm, i) => {
                    const { title, id, done } = itm.doc;
                    return (
                      <ListItem
                        hasCheck={hasCheck}
                        item={itm}
                        title={title}
                        key={i}
                        type={name}
                        id={id}
                        doc={itm.doc}
                        updateListItem={updateListItem}
                        done={done}
                        deleteItem={deleteItem}
                        index={i}
                        itemsDb={itemsDb}
                      />
                    );
                  })}
                  {provided.placeholder}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      )}
    </Droppable>
  );
};

export default List;
