import React, { useState, useEffect } from 'react';
import './App.css';
import { Row, Col ,Modal} from 'antd';
import { Form, Input, Select,Button, Radio,Slider } from 'antd';
import OLEDScreen from './compoments/oledscreen'
import 'antd/dist/antd.css';

const { Option } = Select;
const { TextArea } = Input;


function App() {
  const [customerFontCss, setCustomerFontCss] = useState("");
  const [options,setOptions] = useState({});
  const [customerFont,setCustomerFont] = useState({});
  const [fontList,setFontList] = useState(['宋体','微软雅黑']);
  const [fontSizeList] = useState([12,13,14,15,16,17,18,19,20]);
  const [isShowCustomerFont,showCustomerFont] = useState(false);
  const [form] = Form.useForm();
  const formLayout = {
    labelAlign:'left',
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    }
  };
  const onFormValueChange = (formValues,allValues) => {
    setOptions(allValues);
  };


  useEffect(()=>{
    console.log("use effect called.");
    let customerFont = document.getElementById("customer_style");
    setCustomerFont(customerFont);
  });
  return (
    <div className="main">
  <Form {...formLayout} onValuesChange={onFormValueChange}
        initialValues={{fontsize:fontSizeList[0],font:fontList[0],text:'',enterMode:0,simpleValue:120}} form={form} >
    <Row justify="start" gutter={[10,10]}>
      <Col span={4}>
        <Form.Item label="字体" name="font">
          <Select placeholder="请选择字体" width>
            {fontList.map((item)=>{
              return <Option value={item}>{item}</Option> ;
            })}
          </Select>
        </Form.Item>
      </Col>
      <Col span={3}>
          <Button onClick={()=>{showCustomerFont(true)}} type="primary">自定义字体</Button>
      </Col>
      <Col span={4}>
          <Form.Item label="字号" name="fontsize">
              <Select placeholder="请选择字号">
                {fontSizeList.map((item)=>{
                  return <Option value={item}px>{item}px</Option> ;
                })}
              </Select>
          </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="录入模式" name="enterMode">
            <Radio.Group>
              <Radio value={0}>字符</Radio>
              <Radio value={1}>代码</Radio>
            </Radio.Group>
        </Form.Item>
      </Col>
      <Col flex={1}>
        <Form.Item  label="采样阈值" name="simpleValue">
          <Slider min={1} max={255}/>
        </Form.Item>
      </Col>
      </Row> 
    <Row justify="start" gutter={[8,2]} >
      <Col flex="3">
        <Form.Item labelCol={{span:4}} wrapperCol={{span:20}} label="提取文字" name="text">
          <Input type="text" style={{fontFamily:'iconfont_oled'}} placeholder="请输入文字"/>
        </Form.Item>
      </Col>
      <Col flex="2">
          <Button type="primary">生成代码</Button>
      </Col>
    </Row>

    <Row justify="center" gutter={[8,2]} >
      <Col span={24}>
        <OLEDScreen width="128" height="64" dot="5" options={options} />
      </Col>
    </Row>
  </Form>

      <Modal
          title="自定义字体"
          visible={isShowCustomerFont}
          closable={false}
          onOk={()=>{
            customerFont.appendChild(document.createTextNode(customerFontCss));
            showCustomerFont(false);}}
          onCancel={()=>{showCustomerFont(false)}}
        >
          <Row gutter={[10,10]}>
            <Col span={24}>
              <Input placeholder="请输入字体名称。" />
            </Col>
          </Row>
          <Row>
            <Col  span={24}>
            <TextArea placeholder="请输入字体样式。" onChange={({target:{value}})=>{
            setCustomerFontCss(value);
          }} rows={8} />
          </Col>
          </Row>

      </Modal>
    </div>
  );
}

export default App;
