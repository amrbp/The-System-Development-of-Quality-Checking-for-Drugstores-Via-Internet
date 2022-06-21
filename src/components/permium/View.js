import React from "react";
import ReactToPrint from "react-to-print";
import {ComponentToPrint} from "./down";
import Pdf from "./pdf";

class Viewer extends React.Component {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => <a href="#">Print this out!</a>}
          content={() => this.componentRef}
        />
        <Pdf ref={(el) => (this.componentRef = el)} />
      </div>
    );
  }
}

export default Viewer;
