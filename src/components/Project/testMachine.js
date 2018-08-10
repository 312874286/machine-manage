import { Card, Button, Icon, Popover, Popconfirm, Table } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import styles from './machinePlan.less';

class TestMachine extends PureComponent {
  state = {
    dateTwoWeeksArr: [],
    currentDay: -1,
    currentDayAfter: -1,
    activityArr: [],
    leftCount: 0,
    rightCount: 0,
    startDay: '',
    endDay: '',
    days: 0,
  }
  render() {
    return (
      <div>
        <div className="fc-view-container">
          <div className="fc-view fc-timelineMonth-view fc-timeline fc-unselectable fc-flat">
            <table className="">
              <thead className="fc-head">
              <tr>
                <td className="fc-resource-area fc-widget-header" style={{width: '258px'}}>
                  <div className="fc-scroller-clip">
                    <div className="fc-scroller fc-no-scrollbars"
                         style={{overflowX: 'scroll', 'overflowY': 'hidden', margin: '0px' }}>
                      <div className="fc-scroller-canvas" style={{ minWidth: '140px' }}>
                        <div className="fc-content">
                          <table className="" style={{ height: '55px' }}>
                            <colgroup>
                              <col className="fc-main-col">
                              </col>
                            </colgroup>
                            <tbody>
                            <tr>
                              <th className="fc-widget-header">
                                <div>
                                  <div className="fc-cell-content"><span className="fc-expander-space"><span
                                    className="fc-icon"></span></span><span className="fc-cell-text">商圈</span></div>
                                  <div className="fc-col-resizer"></div>
                                </div>
                              </th>
                              <th className="fc-widget-header">
                                <div>
                                  <div className="fc-cell-content"><span className="fc-cell-text">机器编号</span></div>
                                </div>
                              </th>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="fc-bg"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="fc-divider fc-col-resizer fc-widget-header"></td>
                <td className="fc-time-area fc-widget-header">
                  <div className="fc-scroller-clip">
                    <div className="fc-scroller fc-no-scrollbars"
                         style={{overflowX: 'scroll', 'overflowY': 'hidden', margin: '0px' }}>
                      <div className="fc-scroller-canvas" style={{ width: '0px', minWidth: '931px' }}>
                        <div className="fc-content">
                          <table className="" style={{ height: '55px' }}>
                            <colgroup>
                              {/*<col style="width: 30px;">*/}
                                {/*<col style="width: 30px;">*/}
                                  {/*<col style="width: 30px;">*/}
                                    {/*<col style="width: 30px;">*/}
                                      {/*<col style="width: 30px;">*/}
                                        {/*<col style="width: 30px;">*/}
                                          {/*<col style="width: 30px;">*/}
                                            {/*<col style="width: 30px;">*/}
                                              {/*<col style="width: 30px;">*/}
                                                {/*<col style="width: 30px;">*/}
                                                  {/*<col style="width: 30px;">*/}
                                                    {/*<col style="width: 30px;">*/}
                                                      {/*<col style="width: 30px;">*/}
                                                        {/*<col style="width: 30px;">*/}
                                                          {/*<col style="width: 30px;">*/}
                                                            {/*<col style="width: 30px;">*/}
                                                              {/*<col style="width: 30px;">*/}
                                                                {/*<col style="width: 30px;">*/}
                                                                  {/*<col style="width: 30px;">*/}
                                                                    {/*<col style="width: 30px;">*/}
                                                                      {/*<col style="width: 30px;">*/}
                                                                        {/*<col style="width: 30px;">*/}
                                                                          {/*<col style="width: 30px;">*/}
                                                                            {/*<col style="width: 30px;"></col>*/}
                                                                              {/*<col style="width: 30px;"></col>*/}
                                                                                {/*<col style="width: 30px;"></col>*/}
                                                                                  {/*<col style="width: 30px;"></col>                                                                                    <col style="width: 30px;"></col>*/}
                                                                                    {/*<col style="width: 30px;"></col>*/}
                                                                                      {/*<col style="width: 30px;"></col>*/}
                                                                                        {/*<col style="width: 30px;"></col>*/}
                            </colgroup>
                            <tbody>
                            <tr>
                              <th className="fc-widget-header fc-wed fc-past" data-date="2018-08-01" colSpan="31">
                                <div className="fc-cell-content"><span className="fc-cell-text"
                                                                       style={{position: 'relative', top: '0px', left: '0px;'}}>2018.8</span>
                                </div>
                              </th>
                            </tr>
                            <tr>
                              <th className="fc-widget-header fc-wed fc-past" data-date="2018-08-01">
                                <div className="fc-cell-content"><span className="fc-cell-text">1</span></div>
                              </th>
                              <th className="fc-widget-header fc-thu fc-past" data-date="2018-08-02">
                                <div className="fc-cell-content"><span className="fc-cell-text">2</span></div>
                              </th>
                              <th className="fc-widget-header fc-fri fc-past" data-date="2018-08-03">
                                <div className="fc-cell-content"><span className="fc-cell-text">3</span></div>
                              </th>
                              <th className="fc-widget-header fc-sat fc-past" data-date="2018-08-04">
                                <div className="fc-cell-content"><span className="fc-cell-text">4</span></div>
                              </th>
                              <th className="fc-widget-header fc-em-cell fc-sun fc-past" data-date="2018-08-05">
                                <div className="fc-cell-content"><span className="fc-cell-text">5</span></div>
                              </th>
                              <th className="fc-widget-header fc-mon fc-past" data-date="2018-08-06">
                                <div className="fc-cell-content"><span className="fc-cell-text">6</span></div>
                              </th>
                              <th className="fc-widget-header fc-tue fc-past" data-date="2018-08-07">
                                <div className="fc-cell-content"><span className="fc-cell-text">7</span></div>
                              </th>
                              <th className="fc-widget-header fc-wed fc-past" data-date="2018-08-08">
                                <div className="fc-cell-content"><span className="fc-cell-text">8</span></div>
                              </th>
                              <th className="fc-widget-header fc-thu fc-today" data-date="2018-08-09">
                                <div className="fc-cell-content"><span className="fc-cell-text">9</span></div>
                              </th>
                              <th className="fc-widget-header fc-fri fc-future" data-date="2018-08-10">
                                <div className="fc-cell-content"><span className="fc-cell-text">10</span></div>
                              </th>
                              <th className="fc-widget-header fc-sat fc-future" data-date="2018-08-11">
                                <div className="fc-cell-content"><span className="fc-cell-text">11</span></div>
                              </th>
                              <th className="fc-widget-header fc-em-cell fc-sun fc-future" data-date="2018-08-12">
                                <div className="fc-cell-content"><span className="fc-cell-text">12</span></div>
                              </th>
                              <th className="fc-widget-header fc-mon fc-future" data-date="2018-08-13">
                                <div className="fc-cell-content"><span className="fc-cell-text">13</span></div>
                              </th>
                              <th className="fc-widget-header fc-tue fc-future" data-date="2018-08-14">
                                <div className="fc-cell-content"><span className="fc-cell-text">14</span></div>
                              </th>
                              <th className="fc-widget-header fc-wed fc-future" data-date="2018-08-15">
                                <div className="fc-cell-content"><span className="fc-cell-text">15</span></div>
                              </th>
                              <th className="fc-widget-header fc-thu fc-future" data-date="2018-08-16">
                                <div className="fc-cell-content"><span className="fc-cell-text">16</span></div>
                              </th>
                              <th className="fc-widget-header fc-fri fc-future" data-date="2018-08-17">
                                <div className="fc-cell-content"><span className="fc-cell-text">17</span></div>
                              </th>
                              <th className="fc-widget-header fc-sat fc-future" data-date="2018-08-18">
                                <div className="fc-cell-content"><span className="fc-cell-text">18</span></div>
                              </th>
                              <th className="fc-widget-header fc-em-cell fc-sun fc-future" data-date="2018-08-19">
                                <div className="fc-cell-content"><span className="fc-cell-text">19</span></div>
                              </th>
                              <th className="fc-widget-header fc-mon fc-future" data-date="2018-08-20">
                                <div className="fc-cell-content"><span className="fc-cell-text">20</span></div>
                              </th>
                              <th className="fc-widget-header fc-tue fc-future" data-date="2018-08-21">
                                <div className="fc-cell-content"><span className="fc-cell-text">21</span></div>
                              </th>
                              <th className="fc-widget-header fc-wed fc-future" data-date="2018-08-22">
                                <div className="fc-cell-content"><span className="fc-cell-text">22</span></div>
                              </th>
                              <th className="fc-widget-header fc-thu fc-future" data-date="2018-08-23">
                                <div className="fc-cell-content"><span className="fc-cell-text">23</span></div>
                              </th>
                              <th className="fc-widget-header fc-fri fc-future" data-date="2018-08-24">
                                <div className="fc-cell-content"><span className="fc-cell-text">24</span></div>
                              </th>
                              <th className="fc-widget-header fc-sat fc-future" data-date="2018-08-25">
                                <div className="fc-cell-content"><span className="fc-cell-text">25</span></div>
                              </th>
                              <th className="fc-widget-header fc-em-cell fc-sun fc-future" data-date="2018-08-26">
                                <div className="fc-cell-content"><span className="fc-cell-text">26</span></div>
                              </th>
                              <th className="fc-widget-header fc-mon fc-future" data-date="2018-08-27">
                                <div className="fc-cell-content"><span className="fc-cell-text">27</span></div>
                              </th>
                              <th className="fc-widget-header fc-tue fc-future" data-date="2018-08-28">
                                <div className="fc-cell-content"><span className="fc-cell-text">28</span></div>
                              </th>
                              <th className="fc-widget-header fc-wed fc-future" data-date="2018-08-29">
                                <div className="fc-cell-content"><span className="fc-cell-text">29</span></div>
                              </th>
                              <th className="fc-widget-header fc-thu fc-future" data-date="2018-08-30">
                                <div className="fc-cell-content"><span className="fc-cell-text">30</span></div>
                              </th>
                              <th className="fc-widget-header fc-fri fc-future" data-date="2018-08-31">
                                <div className="fc-cell-content"><span className="fc-cell-text">31</span></div>
                              </th>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="fc-bg"></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </thead>
              <tbody className="fc-body">
              <tr>
                <td className="fc-resource-area fc-widget-content" style="width: 258px;">
                  <div className="fc-scroller-clip">
                    <div className="fc-scroller"
                         style="overflow-x: auto; overflow-y: scroll; height: 155px; margin: 0px;">
                      <div className="fc-scroller-canvas" style="min-width: 140px;">
                        <div className="fc-content">
                          <div className="fc-rows">
                            <table className="">
                              <colgroup>
                                <col className="fc-main-col">
                                  <col>
                              </colgroup>
                              <tbody>
                              <tr data-resource-id="1809510071149">
                                <td className="fc-widget-content">
                                  <div style="height: 37px;">
                                    <div className="fc-cell-content"><span className="fc-expander-space"><span
                                      className="fc-icon"></span></span><span
                                      className="fc-cell-text">天津市天津市和平区鞍山道沿线大沽口</span></div>
                                  </div>
                                </td>
                                <td className="fc-widget-content">
                                  <div className="fc-cell-content"><span className="fc-cell-text">1809510071149</span>
                                  </div>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="fc-bg"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="fc-divider fc-col-resizer fc-widget-header"></td>
                <td className="fc-time-area fc-widget-content">
                  <div className="fc-scroller-clip">
                    <div className="fc-scroller" style="overflow: auto; height: 155px; margin: 0px;">
                      <div className="fc-scroller-canvas" style="width: 0px; min-width: 931px;">
                        <div className="fc-content">
                          <div className="fc-rows">
                            <table className="">
                              <tbody>
                              <tr data-resource-id="1809510071149">
                                <td className="fc-widget-content">
                                  <div style="height: 37px;">
                                    <div className="fc-event-container" style="height: 0px;"></div>
                                    <div className="fc-bgevent-container">
                                      <div className="fc-bgevent"
                                           style="background-color: red; left: 61px; right: -121px;"></div>
                                      <div className="fc-bgevent"
                                           style="background-color: red; left: 0px; right: -91px;"></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="fc-bg">
                          <div className="fc-slats">
                            <table className="">
                              <colgroup>
                                {/*<col style="width: 30px;">*/}
                                  {/*<col style="width: 30px;">*/}
                                    {/*<col style="width: 30px;">*/}
                                      {/*<col style="width: 30px;">*/}
                                        {/*<col style="width: 30px;">*/}
                                          {/*<col style="width: 30px;">*/}
                                            {/*<col style="width: 30px;">*/}
                                              {/*<col style="width: 30px;">*/}
                                                {/*<col style="width: 30px;">*/}
                                                  {/*<col style="width: 30px;">*/}
                                                    {/*<col style="width: 30px;">*/}
                                                      {/*<col style="width: 30px;">*/}
                                                        {/*<col style="width: 30px;">*/}
                                                          {/*<col style="width: 30px;">*/}
                                                            {/*<col style="width: 30px;">*/}
                                                              {/*<col style="width: 30px;">*/}
                                                                {/*<col style="width: 30px;">*/}
                                                                  {/*<col style="width: 30px;">*/}
                                                                    {/*<col style="width: 30px;">*/}
                                                                      {/*<col style="width: 30px;">*/}
                                                                        {/*<col style="width: 30px;">*/}
                                                                          {/*<col style="width: 30px;">*/}
                                                                            {/*<col style="width: 30px;">*/}
                                                                              {/*<col style="width: 30px;">*/}
                                                                                {/*<col style="width: 30px;">*/}
                                                                                  {/*<col style="width: 30px;">*/}
                                                                                    {/*<col style="width: 30px;">*/}
                                                                                      {/*<col style="width: 30px;">*/}
                                                                                        {/*<col style="width: 30px;">*/}
                                                                                          {/*<col style="width: 30px;">*/}
                                                                                          {/*</col>*/}
                              </colgroup>
                              <tbody>
                              <tr>
                                <td className="fc-widget-content fc-wed fc-past fc-day" data-date="2018-08-01">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-thu fc-past fc-day" data-date="2018-08-02">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-fri fc-past fc-day" data-date="2018-08-03">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-sat fc-past fc-day" data-date="2018-08-04">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-sun fc-past fc-day fc-em-cell"
                                    data-date="2018-08-05">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-mon fc-past fc-day" data-date="2018-08-06">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-tue fc-past fc-day" data-date="2018-08-07">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-wed fc-past fc-day" data-date="2018-08-08">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-thu fc-today  fc-day" data-date="2018-08-09">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-fri fc-future fc-day" data-date="2018-08-10">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-sat fc-future fc-day" data-date="2018-08-11">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-sun fc-future fc-day fc-em-cell"
                                    data-date="2018-08-12">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-mon fc-future fc-day" data-date="2018-08-13">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-tue fc-future fc-day" data-date="2018-08-14">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-wed fc-future fc-day" data-date="2018-08-15">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-thu fc-future fc-day" data-date="2018-08-16">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-fri fc-future fc-day" data-date="2018-08-17">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-sat fc-future fc-day" data-date="2018-08-18">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-sun fc-future fc-day fc-em-cell"
                                    data-date="2018-08-19">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-mon fc-future fc-day" data-date="2018-08-20">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-tue fc-future fc-day" data-date="2018-08-21">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-wed fc-future fc-day" data-date="2018-08-22">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-thu fc-future fc-day" data-date="2018-08-23">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-fri fc-future fc-day" data-date="2018-08-24">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-sat fc-future fc-day" data-date="2018-08-25">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-sun fc-future fc-day fc-em-cell"
                                    data-date="2018-08-26">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-mon fc-future fc-day" data-date="2018-08-27">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-tue fc-future fc-day" data-date="2018-08-28">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-wed fc-future fc-day" data-date="2018-08-29">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-thu fc-future fc-day" data-date="2018-08-30">
                                  <div></div>
                                </td>
                                <td className="fc-widget-content fc-fri fc-future fc-day" data-date="2018-08-31">
                                  <div></div>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <div className="fc-license-message">Please use a valid license key.
              <a href="http://fullcalendar.io/scheduler/license/">More Info</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default TestMachine;

