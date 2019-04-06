import React, { Component } from 'react';
import { Row, Col, Typography, Button, Icon } from 'antd';
import './Dashboard.css';
import { TASK_LIST_SIZE } from '../util/Constants';
import { getTasks } from '../util/APIUtils';
import LoadingIndicator from '../common/LoadingIndicator';
import Task from './Task';
import NewTask from './NewTask';

const { Title } = Typography;


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            page: 0,
            size: 5,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: true,
            modal: false
        }

        this.loadTaskList = this.loadTaskList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    loadTaskList(page = 0, size = TASK_LIST_SIZE) {
        let promise;
        promise = getTasks(page, size);
        if (!promise){
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const tasks = this.state.tasks.slice();

            this.setState({
                tasks: tasks.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    componentDidMount() {
        this.loadTaskList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.handleRefresh();
        }
    }

    handleLoadMore() {
        this.loadTaskList(this.state.page + 1);
    }

    handleRefresh() {
         // Reset State
        this.setState({
           tasks: [],
            page: 0,
            size: 5,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            modal: false
        }); 
        this.loadTaskList();
    }

    render() {
        const taskList = [];
        this.state.tasks.forEach((task, taskIndex) => {
            const date = new Date(task.date);
            const today = new Date();
            let isToday = false;

            if (today.getDate() === date.getDate()) {
                isToday = true;
            }

            taskList.push(<Task
                key={task.id}
                task={task}
                today={isToday}
            />);
        });

        return (
            <div>
                <Row type="flex" justify="center" className="dashboard-row">
                    <Col span={8}>
                        <Title level={2} align="middle" className="header">TO DO LIST</Title>
                        <div className="tasks-container">

            
                            {taskList}

                            {
                                !this.state.isLoading && this.state.tasks.length === 0 ? (
                                    <div className="no-tasks-found">
                                        <span>No Tasks Found.</span>
                                    </div>    
                                ): null
                            }  
                            {
                                !this.state.isLoading && !this.state.last ? (
                                    <div className="load-tasks-polls"> 
                                        <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                            <Icon type="plus" /> Load more
                                        </Button>
                                    </div>): null
                            }              
                            {
                                this.state.isLoading ? 
                                <LoadingIndicator />: null                     
                            }
                        </div>
                    </Col>
                </Row>
                <NewTask completeHandler={this.handleRefresh}/>
            </div>
        );
    }
}

export default Dashboard;