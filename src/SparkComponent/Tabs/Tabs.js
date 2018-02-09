import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import { TabPane } from './TabPane';
import './Tabs.less';

export class Tabs extends React.Component {

  static propTypes = {
    defaultActiveKey: PropTypes.string,
  }
  
  state = {
    activeKey: '',
  };

  constructor (props) {
    super(props);
    this.tabChildren = {};
    this.state.activeKey = this.props.defaultActiveKey || this.props.children[1].key;
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateInkStyle();
    this.updateContentStyle();
  }

  updateInkStyle = () => {
    const { activeKey } = this.state;

    let inkWidth, inkOffset;
    const activeTab = this.tabChildren[activeKey];
    inkWidth = activeTab.clientWidth;
    inkOffset = activeTab.offsetLeft;
    this.inkBar.style.width = `${inkWidth}px`;
    this.inkBar.style.transform = `translate3d(${inkOffset}px, 0px, 0px)`;
  }

  updateContentStyle = () => {
    const { activeKey } = this.state;
    const { children } = this.props;
    let activeIndex;
    children.map((child, index) => {
      if (child.key === activeKey) {
        activeIndex = index;
      }
      return null;
    });
    for (let i = 0; i < this.tabsContent.children.length; i++) {
      this.tabsContent.children[i].style.opacity = '0';
    }
    this.tabsContent.style.marginLeft = `-${activeIndex * 100}%`;
    const activeContent = this.tabsContent.children[activeIndex];
    activeContent.style.opacity = '1';
  }

  handleClickTabBar = (activeKey) => {
    this.setState({
      activeKey,
    });
  }

  renderTabBar = () => {
    const { activeKey, inkBarStyle } = this.state;
    const tabBar = this.props.children.map((child) => {
      return (
        <div 
          key={child.key}
          role="tab"
          className="spark-tabs-tab"
          ref={tabChild => this.tabChildren[child.key] = tabChild}
          onClick={() => this.handleClickTabBar(child.key)}
        >
          { child.props.tab }
        </div>
      );
    });

    return (
      <div className="spark-tabs-tabbar">
        <div className="spark-tabs-ink-bar" ref={inkBar => this.inkBar = inkBar}></div>
        { tabBar }
      </div>
    );
  }

  renderTabContent = () => {
    return (
      <div className="spark-tabs-content" ref={tabsContent => this.tabsContent = tabsContent}>
        { this.props.children }
      </div>
    );
  }

  render () {
    return (
      <div className="spark-tabs">
        <div className="spark-tabs-scroll">
          { this.renderTabBar() }          
        </div>
        { this.renderTabContent() }
      </div>
    );
  }
}

Tabs.TabPane = TabPane;
