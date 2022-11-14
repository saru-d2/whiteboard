import { useEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import "./App.css";
import axios from 'axios';
import  { useDropzone } from 'react-dropzone';

function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);
  const [files, setFiles] = useState(null)
  const [pageNo, setPageNo] = useState(1)

  const { getRootProps, getInputProps } = useDropzone({
    accept: "pdf/*",
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles)
      setFiles(acceptedFiles)
      
    },
  })

  // Initialization when the component
  // mounts for the first time
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);

  useEffect(() => {
    console.log('hey')
    if (files == null) {
      console.log('no file')
      return
    }
    console.log(files[0])
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = (e) => {
      axios.post('http://localhost:4000/savePdf', { pdf: e.target.result }).then(res => {
        console.log(res)
      })
    };

  }, [files])


  // Function for starting the drawing
  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    saveToBackend();
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const saveToBackend = (e) => {
    const canvas = document.getElementById('toSave');
    const img = canvas.toDataURL('image/png')
    axios.post('http://localhost:4000/saveImg', { imData: img }).then(res => {
      console.log(res)
    })
  }

  // const uploadSlides = (uploadSlides) => {
  //   console.log('hey')
  //   if (files == null) {
  //     console.log('no file')
  //     return
  //   }
  //   console.log(uploadSlides)
  //   let reader = new FileReader();
  //   reader.readAsDataURL(uploadSlides);
  //   reader.onloadend = (e) => {
  //     axios.post('http://localhost:4000/savePdf', { pdf: e.target.result }).then(res => {
  //       console.log(res)
  //     })
  //   };

  // }

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    ctxRef.current.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    ctxRef.current.stroke();
  };

  const dropzoneText = () => {
    if (files == null) {
      return "drop file here";
    }
    else return files[0].name
  }

  const handleSubmit = (e) => {
    axios.post('http://localhost:4000/setSlide', {pageNo: pageNo}).then(res => {
      console.log(res)
    })
  }

  const handleChange = (e) => {
    setPageNo(e.target.value)
  }

  return (
    <div className="App">
      <h1>Paint App</h1>
      <div className="draw-area">
        <Menu
          setLineColor={setLineColor}
          setLineWidth={setLineWidth}
          setLineOpacity={setLineOpacity}
        />
        <canvas
          id="toSave"
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          ref={canvasRef}
          width={`1280px`}
          height={`720px`}
        />
        <button onClick={saveToBackend}> save
        </button>

        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {dropzoneText()}
        </div>
          <label>
            Name:
            <input type="text" value={pageNo} onChange={handleChange} />
          </label>
          <input type="button" value="apply" onClick={handleSubmit} />
      </div>
    </div>
  );
}

export default App;