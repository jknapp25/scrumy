import React, { Component } from "react";
import { Button, Col, Row, Dropdown, DropdownButton } from "react-bootstrap";
import { IoMdArrowRoundForward } from "react-icons/io";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { slide as Menu } from "react-burger-menu";
import { DateRangePicker } from "react-dates";
import moment from "moment";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../react_dates_overrides.css";

import config from "../_data/config";

var styles = {
  bmMenu: {
    background: "lightgray",
    padding: "1.5em 1.5em 0",
    fontSize: "1.15em",
  },
};

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: "startDate",
    };
  }

  render() {
    const { settings, updateSetting, isMenuOpen, toggleMenuOpen } = this.props;
    const listSettings = [settings.todos, settings.reminders, settings.backlog];

    return (
      <Menu right width={350} isOpen={isMenuOpen} noOverlay styles={styles}>
        <Col>
          <Row className="mb-2">
            <h2 className="text-secondary">Settings</h2>
            <Button
              className="ml-auto text-secondary pt-0"
              variant="link"
              onClick={toggleMenuOpen}
            >
              <IoMdArrowRoundForward size={"1.5em"} />
            </Button>
          </Row>
          <Row className="mb-2">Cadence</Row>
          <Row className="mb-4">
            <DropdownButton
              variant="light"
              title={settings.cadence}
              id="cadence"
            >
              {config.cadences.map((cd, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={e => {
                      updateSetting(settings, "cadence", cd);
                    }}
                  >
                    {cd}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </Row>
          <Row className="mb-2">Date Range</Row>
          <Row className="mb-4">
            <DateRangePicker
              displayFormat="MMM D"
              endDate={moment(settings.endDate)}
              endDateId="end_id"
              endDatePlaceholderText="End Day"
              focusedInput={this.state.focusedInput}
              noBorder
              startDate={moment(settings.startDate)}
              startDateId="start_id"
              startDatePlaceholderText="Start Day"
              onDatesChange={({ startDate, endDate }) => {
                updateSetting(settings, "startDate", startDate);
                updateSetting(settings, "endDate", endDate);
              }}
              onFocusChange={focusedInput => this.setState({ focusedInput })}
            />
          </Row>
          <Row className="mb-2">Lists</Row>
          {listSettings.map((lst, i) => {
            return (
              <Row key={i} className="mb-2">
                <Button
                  variant={"link"}
                  style={{ color: "gray" }}
                  disabled={!lst.canChangeVisibility}
                  onClick={e =>
                    updateSetting(lst.name, "visible", !lst.visible)
                  }
                >
                  {lst.visible ? (
                    <MdVisibility size="1.5em" />
                  ) : (
                    <MdVisibilityOff size="1.5em" />
                  )}
                </Button>
                <input
                  className={"ml-2 border-0 px-2"}
                  style={{ width: "40%", borderRadius: ".25rem" }}
                  value={lst.title}
                  onChange={e => {
                    updateSetting(lst.name, "title", e.target.value);
                  }}
                />
                <DropdownButton
                  variant={lst.headerColor}
                  title={lst.headerColor}
                  id="headerColor"
                  className="ml-2"
                >
                  {config.colors.map((color, i) => {
                    return (
                      <Dropdown.Item
                        key={i}
                        onClick={e => {
                          updateSetting(lst.name, "headerColor", color);
                        }}
                      >
                        {color}
                      </Dropdown.Item>
                    );
                  })}
                </DropdownButton>
              </Row>
            );
          })}
        </Col>
      </Menu>
    );
  }
}
