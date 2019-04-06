import React, { Component } from 'react';
import { Modal, Button, Form, Input, DatePicker, notification } from 'antd';
import { createTask } from '../util/APIUtils';

class NewTask extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    
    handleCancel = (e) => {
        this.setState({
          visible: false,
        });
        this.props.completeHandler();
    }

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }

          const task = {
              "name": values['name'],
              "date": values['date-picker'].format('YYYY-MM-DD')
          }

          createTask(task)
            .then(response => {
                notification.success({
                    message: 'SUCCESS',
                    description: 'Successfully created new task.'
                }); 
                this.props.completeHandler();
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
           

          form.resetFields();
          this.setState({ visible: false });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <div>
                <Button type="primary" shape="round" icon="plus" className="btn-task-add" onClick={this.showModal}></Button>
                <TaskCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
            
        )
    }
}

const TaskCreateForm = Form.create({ name: 'create_task' })(
    class AddForm extends Component {
        render() {
            const { getFieldDecorator } = this.props.form;
            const {
                visible, onCancel, onCreate
            } = this.props;

            return (
                <Modal
                    visible={visible}
                    title="Create new Task"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="Task Title">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please enter the task title', whitespace: true }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="Date">
                                {getFieldDecorator('date-picker', {
                                    rules: [{ type: 'object', required: true, message: 'Please select time!' }]
                                })(
                                    <DatePicker format={"YYYY-MM-DD"}/>
                                )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)

export default NewTask;