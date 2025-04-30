import { useState } from "react";
import "../App.css";

import React, { Component } from "react";

class Square extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className={this.props.state === 1 ? "square alive" : "square"}>
      </div>
    );
  }
}

export default Square;