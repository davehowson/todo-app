import React, { Component } from 'react';
import './Task.css';
import { Checkbox, Row, Col, notification } from 'antd';
import { completeTask } from '../util/APIUtils';

class Task extends Component {
    constructor(props){
        super(props);
        this.state = {
            checked: this.props.task.complete
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(id, event) {
        let status = !this.state.checked
        let completeRequest = {
            taskId: id,
            status: status
        };
        let notifDescription = "";
        if (status){
            notifDescription = "Task marked as COMPLETED";
        } else {
            notifDescription = "Task marked as INCOMPLETE";
        }

        completeTask(completeRequest)
        .then(response => {  
            this.setState({ checked: status });
            notification.success({
                message: 'SUCCESS',
                description: notifDescription
            }); 
        }).catch(error => {
            if(error.status === 401) {
                notification.error({
                    message: 'ERROR',
                    description: error.message || 'Authentication Error.'
                });   
            } else {
                notification.error({
                    message: 'ERROR',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });        
            }
        });
    }

    render() {
        if (this.props.today) {
            return (
                <Row className="task">
                    <Col span={20} className="task-content">
                        <div className="task-name">{this.props.task.name}</div>
                        <div className="task-date">{this.props.task.date} - <span className="today-text">Today</span></div>
                    </Col>
                    <Col span={4}>
                        <Checkbox className="complete-check" onChange={this.handleChange.bind(this, this.props.task.id)} checked={this.state.checked}></Checkbox>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row className="task">
                    <Col span={20} className="task-content">
                        <div className="task-name">{this.props.task.name}</div>
                        <div className="task-date">{this.props.task.date}</div>
                    </Col>
                    <Col span={4}>
                        <Checkbox className="complete-check" onChange={this.handleChange.bind(this, this.props.task.id)} checked={this.state.checked}></Checkbox>
                    </Col>
                </Row>
            )
        }
    }
}

export default Task;