import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 

export class Sidebar extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
    }),
  }

  state = {
    navItems: [
      { pathname: '/', label: 'Home', icon: 'home' },
      { pathname: '/portfolio', label: 'Portfolio', icon: 'briefcase' },
      { pathname: '/pipeline', label: 'Pipeline', icon: 'chart-line' },
      { pathname: '/award-search', label: 'Award Search', icon: 'search' },
    ],
  }

  isSelected(navItem) {
    return this.props.location && this.props.location.pathname === navItem.pathname ? 'selected' : '';
  }

  renderLinks() {
    return this.state.navItems.map((navItem) => (
      <li className={`al-sidebar-list-item ${this.isSelected(navItem)}`} key={navItem.pathname}>
        <Link className="al-sidebar-list-link" to={navItem.pathname}>
          <i className={`fa fa-${navItem.icon}`}></i>
          <span>{navItem.label}</span>
        </Link>
      </li>
    ));
  }

  render() {
    return (
      <aside className="al-sidebar">
        <div className="sidebar-header">
          <h2>VYNE</h2>
        </div>
        <ul className="al-sidebar-list">
          {this.renderLinks()}
        </ul>
      </aside>
    );
  }
}

export default Sidebar;
