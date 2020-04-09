import React from 'react';
//import {fontData} from './fontdata';
import {fontData} from "./chineseFont";
class OLEDScreen extends React.Component {
    constructor(props) {
        super(props);
        const {width,height} = this.props;
        this.mainCanvas = React.createRef();
        this.textCanvas = React.createRef();
        this.ctx = null;
        this.textctx = null;
        this.buffer = Array.apply(null, Array(width*height)).map( () => 0 );
        this.state = {
            pad : 5,
            sizeOfJumpTable : 4, //JumpTable字节数
            sizeOfFontHeader : 4 //字体头部定义

        }
    }

    render() {
        const {width,height,dot,options} = this.props;
        const {pad} = this.state;

        let screenWidth = width * dot + pad * 2 + 1;
        let screenHeight = height * dot + pad * 2 + 1;
        console.log(options);
        let marginLeft = parseInt(width)+2;
        return ( 
            <div >
                <canvas ref={this.textCanvas} width={width} height={height} style={{border:'1px solid #ccc'}} />
                <canvas ref={this.mainCanvas} width={screenWidth} height={screenHeight} style={{marginLeft:-marginLeft,backgroundColor:'#eee', border:'1px solid #ccc'}} />
            </div>);
    }
    
    drawText(text){
        console.log("drawText",text);
        text = "\ue630";
        const {width,height} = this.props;
        this.textctx.clearRect(0,0,width,height);
        this.buffer = this.buffer.map( () => 0 );
        if(!text)
            return;

        this.textctx.font='14px iconfont_oled';
        this.textctx.fillStyle = '#000';
        let textMetrics = this.textctx.measureText(text);
        console.log(textMetrics);
        let textWidth = textMetrics.width;
        let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
        this.textctx.fillText(text, 0, textHeight);
        let imageData = this.textctx.getImageData(0,0,textWidth,textHeight);
        textWidth = imageData.width;
        textHeight = imageData.height;
        let x = 0, y = 0;

        for(let i=0;i<imageData.data.length; i+=4){
            let r = imageData.data[i];
            let g = imageData.data[i + 1];
            let b = imageData.data[i + 2];
            let a = imageData.data[i + 3];
            let pixel = (r+g+b+a <=170 ) ? 0:1;
            let pos = x * width + y;
            this.buffer.splice(pos,1,pixel);
            y += 1;
            if(y === textWidth){
                y = 0;
                x +=1;
            }
        }
    }
    drawScreen(){
        const {width,height,dot} = this.props;
        const {pad} = this.state;
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(0 , 0, width, height);

        for(let y = 0; y < height; y++)
            for(let x = 0; x < width; x++){
                let pos = y * width + x;
                this.ctx.fillStyle = this.buffer[pos] === 1 ? '#333' : '#ccc';
                this.ctx.fillRect(x * dot + pad + 1 , y * dot + pad + 1 , dot-1, dot-1);
            }
    }

    drawChars(chars){
        const {width} = this.props;
        const {buffer, sizeOfJumpTable, sizeOfFontHeader} = this.state;
        //获取字体数据
        //let fontWidth = fontData[0];
        let fontHeight = fontData[1];
        let fontFirstCharCode = fontData[2];
        let fontNumOfChars = fontData[3];
        
        let x = 0 , y = 0;
        for(let c=0;c< chars.length;c++){
            let charCode = chars.charCodeAt(c) - fontFirstCharCode;
            console.log("charcode:",charCode);    
            // 4 Bytes per char code
            let posOfJumpTable = charCode * sizeOfJumpTable + sizeOfFontHeader;

            let msbJumpToChar    = fontData[posOfJumpTable];     // MSB  数据所在偏移量的高位字节
            let lsbJumpToChar    = fontData[posOfJumpTable+1];   // LSB  数据所在偏移量的低位字节
            let charByteSize     = fontData[posOfJumpTable+2];   // Size
            let currentCharWidth = fontData[posOfJumpTable+3];  // Width
            console.log("MSB",msbJumpToChar,"LSB",lsbJumpToChar,"SIZE",charByteSize,"WIDTH",currentCharWidth);
            //字符数据位置计算 字体头部偏移 + JUMPTable + 偏移地址（MSB << 8 + LSB）
            let charDataPosition =  sizeOfFontHeader + fontNumOfChars * sizeOfJumpTable + ((msbJumpToChar << 8) + lsbJumpToChar);

            let rasterHeight = 1 + ((fontHeight - 1)>>3);
            console.log("charByteSize:",charByteSize,"CharHeight:",rasterHeight);
            
            for(let key=0; key<charByteSize; key += rasterHeight){
                y = rasterHeight * 8;
                for( let i =rasterHeight-1; i>=0;i--){
                    let num = fontData[key+i+charDataPosition];
                    console.log("key:",key,"c",i,"Number:",num);
                    for (let i=0;i<8;i++){
                        let pixel = 0;
                        pixel = num&0x80 ? 1:0;
                        num <<=1;
                        let pos = y * width + x;
                        buffer.splice(pos,1,pixel);
                        y -= 1;
                    }
                }
                x += 1;
            }
        }
    }
    
    componentDidMount(){
        console.log("didmount.")
        const {options} = this.props;
        this.ctx = this.mainCanvas.current.getContext("2d");
        this.textctx = this.textCanvas.current.getContext("2d");
        if(options && options.text)
            this.drawText(options.text);
        
        //this.drawChars();
        this.drawScreen();
    }
    componentDidUpdate(){
        console.log("did update")
        const {options} = this.props;
        this.ctx = this.mainCanvas.current.getContext("2d");
        this.textctx = this.textCanvas.current.getContext("2d");
        if(options)
            this.drawText(options.text);
        
        //this.drawChars();
        this.drawScreen();
    }
}

export default OLEDScreen;