import React, { useState, useEffect } from 'react';
import './App.css';
import { Row, Col } from 'antd';
import { Form, Input, Select,Button, Radio,Slider } from 'antd';
import OLEDScreen from './compoments/oledscreen'
import 'antd/dist/antd.css';

const { Option } = Select;


function App() {
  const [options,setOptions] = useState({});
  const [form] = Form.useForm();
  const formLayout = {
    labelAlign:'left',
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
  const onFormValueChange = (formValues,allValues) => {
    setOptions(allValues);
  };


  useEffect(()=>{
    let head = document.getElementsByTagName("head");
    //head.appendChild("")
  });
  const fontSize = [12,13,14,15,16,17,18,19,20];
  const fontName = ['宋体','微软雅黑'];
  return (
    <div className="main">
  <Form {...formLayout} onValuesChange={onFormValueChange}
        initialValues={{fontsize:fontSize[0],font:fontName[0],text:'',enterMode:0,simpleValue:120}} form={form} >
    <Row justify="start" gutter={[8,2]}>
      <Col flex={1}>
        <Form.Item label="字体" name="font">
          <Select placeholder="请选择字体">
            {fontName.map((item)=>{
              return <Option value={item}>{item}</Option> ;
            })}
          </Select>
        </Form.Item>
      </Col>
      <Col flex={1}>
          <Form.Item label="字号" name="fontsize">
              <Select placeholder="请选择字号">
                {fontSize.map((item)=>{
                  return <Option value={item}px>{item}px</Option> ;
                })}
              </Select>
          </Form.Item>
      </Col>
      <Col flex={1}>
        <Form.Item label="录入模式" name="enterMode">
            <Radio.Group>
              <Radio value={0}>字符模式</Radio>
              <Radio value={1}>代码模式</Radio>
            </Radio.Group>
        </Form.Item>
      </Col>
      <Col flex={3}>
        <Form.Item  label="采样阈值" name="simpleValue">
          <Slider min={1} max={255}/>
        </Form.Item>
      </Col>
      </Row> 
    <Row justify="start" gutter={[8,2]} >
      <Col flex="3">
        <Form.Item labelCol={{span:4}} wrapperCol={{span:20}} label="提取文字" name="text"
          rules={[{type:'hex'}]}>
          <Input type="text" style={{fontFamily:'iconfont_oled'}} placeholder="请输入文字"/>
        </Form.Item>
      </Col>
      <Col flex="2">
          <Button type="primary"> 生成代码</Button>
      </Col>
    </Row>

    <Row justify="center" gutter={[8,2]} >
      <Col span={24}>
        <OLEDScreen width="128" height="64" dot="5" options={options} />
      </Col>
    </Row>
  </Form>
    </div>
  );
}

export default App;
