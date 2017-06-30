// @flow

import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red500, grey50, grey900, lightWhite, white } from 'material-ui/styles/colors';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FullWidthSection from './FullWidthSection';

import GithubIcon from './components/GithubIcon';
import Search from 'material-ui/svg-icons/action/search';
import NoteAdd from 'material-ui/svg-icons/action/note-add';
import ViewList from 'material-ui/svg-icons/action/view-list';

import { Link } from 'react-router-dom';
import Routes from './Routes';

/* See http://stackoverflow.com/questions/37400648/cant-style-datepiker-popup-dialog */
const muiTheme = getMuiTheme({
    datePicker: {
        color: red500,
        selectColor: red500,
    },
    timePicker: {
        accentColor: red500,
        headerColor: red500,
        selectColor: red500,
    },
    flatButton: {
        primaryTextColor: red500,
    },
    raisedButton: {
        primaryColor: red500,
    },
});

class App extends React.Component {

    state = {
        drawerIsOpen: false,
    };

    toggleDrawer = () => {
        this.setState({ drawerIsOpen: !this.state.drawerIsOpen });
    }

    closeDrawer = () => {
        this.setState({ drawerIsOpen: false });
    }

    appBar() {
        const styles = {
            appBar: {
                backgroundColor: red500,
            },
        };

        return (
            <AppBar
                zDepth={0}
                style={styles.appBar}
                onLeftIconButtonTouchTap={this.toggleDrawer}
                iconElementRight={
                    <IconButton href="https://github.com/tanzdervampire/">
                        <GithubIcon />
                    </IconButton>
                }
            />
        );
    };

    footer() {
        const styles = {
            root: {
                textAlign: 'center',
                backgroundColor: grey900,
                overflow: 'hidden',
            },
            p: {
                color: lightWhite,
            },
        };

        return (
            <FullWidthSection style={styles.root}>
                <div>
                    <p style={styles.p}>
                        Created by Ingo Bürk, 2017.
                    </p>
                    <IconButton href="https://github.com/tanzdervampire/">
                        <GithubIcon color={white} />
                    </IconButton>
                </div>
            </FullWidthSection>
        );
    };

    render() {
        const styles = {
            content: {
                backgroundColor: grey50,
                overflow: 'hidden',
                textAlign: 'center',
            },
        };

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    {this.appBar()}

                    <Drawer
                        docked={false}
                        open={this.state.drawerIsOpen}
                        onRequestChange={(drawerIsOpen) => this.setState({ drawerIsOpen })}
                    >
                        <MenuItem
                            leftIcon={<Search />}
                            onTouchTap={this.closeDrawer}
                            containerElement={<Link to="/" />}
                        >
                            Cast suchen
                        </MenuItem>

                        <MenuItem
                            leftIcon={<ViewList />}
                            onTouchTap={this.closeDrawer}
                            containerElement={<Link to="/shows" />}
                        >
                            Liste aller Vorstellungen
                        </MenuItem>

                        <Divider />

                        <MenuItem
                            leftIcon={<NoteAdd />}
                            onTouchTap={this.closeDrawer}
                            containerElement={<Link to="/shows/new" />}
                        >
                            Castliste hinzufügen
                        </MenuItem>
                    </Drawer>

                    <div style={styles.content}>
                        <Routes />
                    </div>

                    {this.footer()}
                </div>
            </MuiThemeProvider>
        );
    };

}

export default App;
