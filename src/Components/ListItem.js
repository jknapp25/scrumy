import React from "react";
import { Form, Button } from "react-bootstrap";
import { Draggable } from "react-beautiful-dnd";
import { IoMdClose } from "react-icons/io";

const ListItem = props => {
  const [hovering, setHovering] = React.useState(false);
  const {
    title,
    hasCheck,
    updateListItem,
    id,
    doc,
    done,
    index,
    item,
    itemsDb,
  } = props;

  const deleteItem = doc => itemsDb.remove(doc);

  return (
    <Draggable key={id} draggableId={id} index={index}>
      {provided => (
        <tr
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {hasCheck && (
            <td className="text-left" style={{ width: "15px" }}>
              <Form.Check
                type="checkbox"
                id="default-checkbox"
                className="ml-2"
                defaultChecked={done}
                onClick={e =>
                  updateListItem(item.doc, "done", e.target.checked)
                }
              />
            </td>
          )}
          <td className={`text-left ${hasCheck && "pl-0"}`}>
            {done ? (
              <s className={"ml-2 text-secondary"}>{title}</s>
            ) : (
              <input
                className={`ml-2 border-0 ${!hovering &&
                  "w-100"} d-inline-block`}
                value={title}
                onChange={e => {
                  updateListItem(item.doc, "title", e.target.value);
                }}
              />
            )}
            {hovering && (
              <Button
                className="px-0 mx-0 float-right d-inline-block my-0 py-0 text-secondary"
                variant="link"
                onClick={() => deleteItem(doc)}
              >
                <IoMdClose />
              </Button>
            )}
          </td>
        </tr>
      )}
    </Draggable>
  );
};

export default ListItem;
