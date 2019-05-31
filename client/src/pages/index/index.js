import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import { 
    Icon,  Button,
    Input, Checkbox, Form, Select
} from 'tvirus';
import './index.less';


const rules = {
    project: [
        {
            required: true,
            message: '请选择项目'
        }
    ],
    pid: [
        {
            required: true,
            message: '请设置项目编号'
        }
    ],
    viewport_width: [{
        required: true,
        message: '请设置视窗宽度'
    }],

    jump_url: [{
        required: true,
        message: '需要测试的页面'
    }],
    username: [{
        required: true,
        message: '待测试系统的用户名'
    }],
    password: [
        {
            required: true,
            message: '请填写密码'
        }
    ],
    uipng: [
        {
            required: true,
            message: '请上传图片'
        }
    ]
}

export default class IndexPage extends Component{
    state = {
        result: null
    }
    handleOnSubmit = (valid, values) => {
        if(!valid){
            return;
        }
        const formData = new FormData();

        for(let key in values){
            let value = values[key];
            if(Array.isArray(value)){
                value = value[0];
            }
            formData.append(key, value);
        }

        $.ajax({  
            url : '/api/submit',  
            type : 'post',  
            data : formData,  
            processData : false, 
            contentType : false,
            success: (res) => {
                if(res.status === 200){
                    this.loop(res.data.key)
                }else{
                    console.log("失败");
                }
            },  
            error(res) { 
                console.log("error", res);
            }  
        }); 
    }
    loop(key){
        if(!key){
            return;
        }

        setTimeout(() => {
            $.ajax({  
                url : '/api/result',  
                data : {key},  
                success: (res) => {
                    if(res.status === 1000){
                        return this.loop(key)
                    } 
                    if(res.status === 200){
                        this.setState({
                            result: res.data
                        });
                    }
                }  
            }); 
        }, 200)

    }
    render(){
        const { result } = this.state;
        if(result){
            const mis = JSON.parse(result.result.result);
            return (
                <div className="result">
                    <p>丢失率：{mis.misMatchPercentage}%</p>
                    <img src={`img/${result.project}_${result.pid}/${result.id}/result.png`} />
                </div>
            )
        }

        return (
            <div className="tv-uitest">
                <div className="tv-uitest-top">
                    <div className="tv-uitest-header">
                        <a href="#">UITEST</a>
                    </div>
                    <div className="tv-uitest-desc">
                        自动化UI测试平台
                    </div>
                </div>
                <div className="tv-components-login-index-login">
                    <Form onSubmit={this.handleOnSubmit} rules={rules}>
                        <Form.Item name="project">
                            <Form.Field name="project" tagName="select" size="large" placeholder="项目分类" prefix="user">
                                <Select.Option value="bw">bw</Select.Option>
                                <Select.Option value="ai">ai</Select.Option>
                                <Select.Option value="aiface">aiface</Select.Option>
                                <Select.Option value="finance">finance</Select.Option>
                            </Form.Field>
                        </Form.Item>
                        <Form.Item name="pid">
                            <Form.Field name="pid" tagName="input" size="large" placeholder="项目编号" />
                        </Form.Item>
                        <h5>测试容器相关设置</h5>
                        <Form.Item name="viewport_width">
                            <Form.Field value="1366" name="viewport_width" tagName="input" size="large" placeholder="视窗宽度" />
                        </Form.Item>
                        <h5>系统相关的设置</h5>
                        <Form.Item name="jump_url">
                            <Form.Field name="jump_url" tagName="input" size="large" placeholder="需要测试的页面" />
                        </Form.Item>
                        <Form.Item name="hotel_name">
                            <Form.Field name="hotel_name" tagName="input" size="large" placeholder="需要切换的测试酒店" />
                        </Form.Item>
                        <Form.Item name="username">
                            <Form.Field name="username" tagName="input" size="large" placeholder="用户名" />
                        </Form.Item>
                        <Form.Item name="password">
                            <Form.Field name="password" tagName="input" size="large" placeholder="密码" />
                        </Form.Item>


                        <Form.Item name="uipng">
                            <Form.Field type="file" name="uipng" tagName="input" size="large" placeholder="设计图png" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                className="tv-submit"
                                size="large"
                                type="primary"
                            >
                                开始测试
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
