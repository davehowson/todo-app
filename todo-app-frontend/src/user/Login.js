import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { 
    Typography,
    Form, Icon, Input, Button,
} from 'antd';
import { login } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../util/Constants';
import './Login.css';

const { Title } = Typography;

class Login extends Component {
    render() {
        const WrappedLoginForm = Form.create({ name: 'login_form' })(LoginForm);
        return (
            <WrappedLoginForm onLogin={this.props.onLogin} />
        )
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit = event => {
        event.preventDefault();
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    this.props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {
                        console.log("Incorrect Credentials");                 
                    } else {
                        console.log("Error ", error);                                           
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row type="flex" justify="center" className="login-row">
                <Col span={8}>
                    <div className="form-container">
                        <Title level={2}>Login</Title>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('usernameOrEmail', {
                                    rules: [{ required: true, message: 'Please input your username or email!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username or Email" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please input your Password!' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Login;