import React, { Component } from 'react';
import { getUserProfile } from '../util/APIUtils';
import { Row, Col, notification, Avatar } from 'antd';
import Title from 'antd/lib/typography/Title';
import LoadingIndicator from '../common/LoadingIndicator';
import './Profile.css';

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: null,
            joinedAt: null,
            isLoading: true
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    loadUserProfile() {
        this.setState({
            isLoading: true
        });

        getUserProfile()
        .then(response => {
            this.setState({
                user: response,
                isLoading: false
            });
            this.formatDate(response.joinedAt);
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
                notification.error({
                    message: 'ERROR',
                    description: error.message || 'Authentication Error.'
                }); 
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });  
                notification.error({
                    message: 'ERROR',
                    description: error.message || 'Server Error.'
                });       
            }
        });        
    }
      
    componentDidMount() {
        this.loadUserProfile();
    }

    formatDate(joinedAt){
        var joinedAtDate = new Date(joinedAt);
        this.setState({
            joinedAt: joinedAtDate.toDateString()
        });
    }

    render() {
        if(!(this.state.isLoading) && (this.state.user != null)) {
            return (
                <div>
                    <Row type="flex" justify="center" className="dashboard-row">
                        <Col span={6}>
                            <Title level={2} className="header">User Profile</Title>
                            <div className="user-profile">
                                <Row type="flex" justify="center" >
                                    <Col>
                                        <Avatar size={120} icon="user" className="user-avatar" />
                                    </Col>
                                </Row>
                                <Row justify="center" >
                                    <Col className="user-details">
                                        Username: {this.state.user.username}<br/>
                                        Full Name: {this.state.user.name}<br/>
                                        Task Count: {this.state.user.taskCount}<br/>
                                        Joined Date: {this.state.joinedAt}<br/>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }

        return (
           <LoadingIndicator/>
        )
    }
}

export default Profile;