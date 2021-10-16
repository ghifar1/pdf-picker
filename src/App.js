import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import certif from "./filepdf/example_certif.pdf";
import { PDFDocument } from 'pdf-lib'
import './App.css';

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [mouseCoordinate, setMouseCoordinate] = useState({
    x: undefined,
    y: undefined
  })
  const inputRef = useRef();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const _onMouseMove = (e) => {
    console.log(e) 
    //  console.log('SCREEN X : ' + e.screenX + ' Y: ' + e.screenY)
    //  console.log('PAGE X : ' + e.pageX + ' Y: ' + e.pageY)
    // console.log(inputRef.current.getBoundingClientRect())
    let rect = inputRef.current.getBoundingClientRect()
    
    let ix = inputRef.current.offsetWidth - (e.clientX - rect.left);
    let iy = inputRef.current.offsetHeight - (e.clientY - rect.top);
    console.log(ix + " " + iy);
    setMouseCoordinate(mouseCoordinate => ({ ...mouseCoordinate, x: e.pageX, y: iy }))

  
    
     


  }

  useEffect(() => {
    // console.log('X: ' + mouseCoordinate.x + ' Y: ' + mouseCoordinate.y)
  }, [mouseCoordinate])



  async function onPdfClick() {
    console.log('X: ' + mouseCoordinate.x + ' Y: ' + mouseCoordinate.y)
    const buff = await (await fetch(certif)).arrayBuffer();
    console.log(buff)
    const PDFDoc = await PDFDocument.load(buff);

    //------------------------
    const pages = PDFDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    firstPage.drawText('Muhammad Al Ghifari', {
      x: mouseCoordinate.x - 10,
      y: mouseCoordinate.y - 50,
      size: 40
    });

    const filePdf = await PDFDoc.save();
    console.log(filePdf);
    const fileblob = new Blob([filePdf], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(fileblob);
    //Open the URL on new Window
    const pdfWindow = window.open();
    pdfWindow.location.href = fileURL;
  }

  return (
    <div onClick={onPdfClick} ref={inputRef} onMouseMove={_onMouseMove} className="cursorPdf">
      <Document
        file={certif}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
    </div>
  );
}

export default App;
