import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import Debounce from 'lodash-decorators/debounce';
const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    // return <Icon type={icon} />;
    // {'../../assets/images/menuImg/' + icon + '.png'}
    let imgSrc = require(`../../assets/images/menuImg/${icon}.png`)
    let imgSrc2 = require(`../../assets/images/menuImg/${icon}Selected.png`)
    return <Icon>
      <img src={imgSrc} alt="icon" className={styles.icon} />
      <img src={imgSrc2} alt="icon" className={styles.icon} />
    </Icon>;
  }
  return icon;
};

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      });
    }
  }
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    // console.log('pathname', pathname)
    const snippets = pathname.split('/').slice(1, -1);
    const currentPathSnippets = snippets.map((item, index) => {
      const arr = snippets.filter((_, i) => i <= index);
      return arr.join('/');
    });
    // console.log('pathname', snippets)
    let currentMenuSelectedKeys = [];
    currentPathSnippets.forEach((item) => {
      currentMenuSelectedKeys = currentMenuSelectedKeys.concat(this.getSelectedMenuKeys(item));
    });
    // console.log('pathname', currentPathSnippets)
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard/index'];
    }
    return currentMenuSelectedKeys;
  }
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach((item) => {
      if (item.children) {
        keys.push(item.path);
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      } else {
        keys.push(item.path);
      }
    });
    return keys;
  }
  getSelectedMenuKeys = (path) => {
    const flatMenuKeys = this.getFlatMenuKeys(this.menus);
    // console.log(
    //   path,
    //   flatMenuKeys.indexOf(path.replace(/^\//, '')),
    //   flatMenuKeys.indexOf(path.replace(/^\//, '').replace(/\/$/, '')),
    // )
    // if (flatMenuKeys.indexOf(path.replace(/^\//, '')) > -1) {
    //   return [path.replace(/^\//, '')];
    // }
    // if (flatMenuKeys.indexOf(path.replace(/^\//, '').replace(/\/$/, '')) > -1) {
    //   return [path.replace(/^\//, '').replace(/\/$/, '')];
    // }
    return flatMenuKeys.filter((item) => {
      const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
      const itemRegExp = new RegExp(itemRegExpStr);
      // console.log('yy', itemRegExp.test(path.replace(/^\//, '')))
      // if (path === '/homePage/index') {
      //   return true
      // }
      return itemRegExp.test(path.replace(/^\//, '').replace(/\/$/, ''));
    });
    // return [flatMenuKeys[0]]
  }
  /**
  * 判断是否是http链接.返回 Link 或 a
  * Judge whether it is http link.return a or Link
  * @memberof SiderMenu
  */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          <span style={{'width': '6px', 'background': item.color, 'height': '40px', 'left': 0, 'position': 'absolute'}}></span>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={this.props.isMobile ? () => { this.props.onCollapse(true); } : undefined}
      >
        <span style={{'width': '6px', 'background': item.color, 'height': '40px', 'left': 0, 'position': 'absolute'}}></span>
        {icon}<span>{name}</span>
      </Link>
    );
  }
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item) => {
    if (item.children && item.children.some(child => child.name)) {
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {/*selectedBg*/}
                <span className={styles.selectedBg}></span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>
            ) : item.name
          }
          key={item.key || item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.key || item.path}>
          {this.getMenuItemPath(item)}
        </Menu.Item>
      );
    }
  }
  /**
  * 获得菜单子节点
  * @memberof SiderMenu
  */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map((item) => {
        const ItemDom = this.getSubMenuOrItem(item);
        // return this.checkPermissionItem(item.authority, ItemDom);
        return ItemDom;
      })
      .filter(item => !!item);
  }
  // conversion Path
  // 转化路径
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  }
  // permission to check
  // checkPermissionItem = (authority, ItemDom) => {
  //   if (this.props.Authorized && this.props.Authorized.check) {
  //     const { check } = this.props.Authorized;
  //     return check(
  //       authority,
  //       ItemDom
  //     );
  //   }
  //   return ItemDom;
  // }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    console.log('triggerResizeEvent')
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  handleOpenChange = (openKeys) => {
    console.log('openKeys', openKeys)
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }
  render() {
    const { logo, collapsed, location: { pathname }, onCollapse } = this.props;
    const { openKeys } = this.state;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys,
    };
    // console.log('selectedKeys0', openKeys)
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    // console.log('selectedKeys', selectedKeys, openKeys)
    if (!selectedKeys.length) {
      // console.log('selectedKeys1', selectedKeys)
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    // console.log('selectedKeys2', selectedKeys)
    // console.log('collapsed', collapsed, collapsed, onCollapse )
    return (
      <div className={styles.siderBox}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          // // md
          onCollapse={onCollapse}
          width={180}
          className={styles.sider}>
          <div className={styles.logo} key="logo">
            <Link to="/">
              <img src={logo} alt="logo" />
              <h1>ERP</h1>
            </Link>
          </div>
          <Icon
            className={styles.trigger}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
          <Menu
            key="Menu"
            theme="dark"
            mode="inline"
            // inlineCollapsed="false"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
            className={styles.MenuBackground}>
            {this.getNavMenuItems(this.menus)}
          </Menu>
        </Sider>
      </div>
    );
  }
}
