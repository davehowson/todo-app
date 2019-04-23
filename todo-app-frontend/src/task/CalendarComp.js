import React, { Component } from "react";
import { Calendar, Badge } from 'antd';
import './CalendarComp.css';

class CalendarComp extends Component {
    constructor(props) {
        super(props);
        this.getListData = this.getListData.bind(this);
        this.dateCellRender = this.dateCellRender.bind(this);
    }

    getListData(value) {
        let listData;
        switch (value.date()) {
            case 8:
            listData = [
                { type: 'error', id: 1}
            ]; break;
            case 10:
            listData = [
                { type: 'error', id: 2}
            ]; break;
            default:
        }
        return listData || [];
    }

    dateCellRender(value) {
        const listData = this.getListData(value);
        return (
            <div>
            {
                listData.map(item => (
                    <span key={item.id} className="badge-span"><Badge status={item.type} /></span>
                ))
            }
            </div>
        );
    }

    render() {
        return (
            <Calendar dateCellRender={this.dateCellRender} fullscreen={false} onSelect={this.props.onDateSelect} />
        );
    }
}

export default CalendarComp;