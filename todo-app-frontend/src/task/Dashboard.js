import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import './Dashboard.css';
import { TASK_LIST_SIZE } from '../util/Constants';
import { getTasks } from '../util/APIUtils';
import Task from './Task';
import NewTask from './NewTask';
import CalendarComp from './CalendarComp';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dayCount: 0,
            dayText: 'Today',
            dateText: moment().format("MMM Do, YYYY"),
            tasks: [],
            page: 0,
            size: 20,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: true,
            modal: false
        }

        this.loadTaskList = this.loadTaskList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleNextDay = this.handleNextDay.bind(this);
        this.handlePrevDay = this.handlePrevDay.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateSelect = this.handleDateSelect.bind(this);
    }

    loadTaskList(page = 0, size = TASK_LIST_SIZE, dayCount = this.state.dayCount, loadMore = true) {
        let promise;
        let date = moment(new Date()).add(dayCount, 'days').format("YYYY-MM-DD");
        this.handleDateChange(date);
        promise = getTasks(page, 5, date);
        if (!promise){
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            let taskList;

            if (loadMore) {
                const tasks = this.state.tasks.slice();
                taskList = tasks.concat(response.content);
            } else {
                taskList = response.content;
            }

            this.setState({
                tasks: taskList,
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

    handleDateSelect(date) {
        console.log(date.format("YYYY-MM-DD"))
        let now = moment(new Date());
        let diff = moment.duration(date.diff(moment(now))).asDays();
        console.log(diff)


        let dayCount = this.state.dayCount + diff
        this.setState({
            tasks: [],
            isLoading: false,
            dayCount: dayCount
        });
        this.loadTaskList(undefined, undefined, dayCount, false);
    }

    handleDateChange(date) {
        if (moment(date).isSame(moment(), 'day')) {
            this.setState({
                dayText: 'Today'
            })
        } else {
            this.setState({
                dayText: moment(date).format('dddd'),
                dateText: moment(date).format("MMM Do, YYYY")
            });
        }

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
            dayCount: 0,
            page: 0,
            size: 20,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            modal: false
        }); 
        this.loadTaskList();
    }

    handleNextDay() {
        let dayCount = this.state.dayCount + 1
        this.setState({
            tasks: [],
            isLoading: false,
            dayCount: dayCount
        });
        this.loadTaskList(undefined, undefined, dayCount, false);
    }

    handlePrevDay() {
        let dayCount = this.state.dayCount - 1
        this.setState({
            tasks: [],
            isLoading: false,
            dayCount: dayCount
        });
        this.loadTaskList(undefined, undefined, dayCount, false);
    }

    render() {
        const taskList = [];
        this.state.tasks.forEach((task, taskIndex) => {
            taskList.push(<Task
                key={task.id}
                task={task}
            />);
        });

        return (
            <div className="dashboard">
                <Row className="dashboard-row">
                    <Col span={14} className="task-col">
                        <div className="task-nav">
                            <div className="task-nav-icon" id="task-nav-left">
                                <Icon type="left" onClick={this.handlePrevDay} />
                            </div>
                            <div className="task-nav-icon" id="task-nav-right">
                                <Icon type="right" onClick={this.handleNextDay}/>
                            </div> 
                            <div id="task-nav-center">
                                <div id="task-nav-date">{this.state.dayText}</div>
                                <div>{this.state.dateText}</div>
                            </div>
                        </div>
                        <div className="task-list">
                            <Scrollbars renderThumbVertical={({ style, ...props }) =>
                                <div {...props} style={{ ...style, backgroundColor: '#FFF', width: '2px', opacity: '0.4'}}/>
                            }>
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
                            </Scrollbars>
                        </div>
                    </Col>
                    <Col span={10} className="calendar-col">
                        <div id="calendar-title">
                            Calendar
                        </div>
                        <div id="calendar">
                            <CalendarComp onDateSelect={this.handleDateSelect}/>
                        </div>
                    </Col>
                </Row>
                <NewTask completeHandler={this.handleRefresh}/>
            </div>
        );
    }
}

export default Dashboard;