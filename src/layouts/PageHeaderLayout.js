import React from 'react';
import { Link } from 'dva/router';
import PageHeader from '../components/PageHeader';
import styles from './PageHeaderLayout.less';
// paddingLeft: '180px'
export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div style={{ margin: '-24px -24px 0', paddingTop: '91px' }} className={wrapperClassName}>
    {top}
    <PageHeader key="pageheader" {...restProps} linkElement={Link} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);
