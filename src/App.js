// @flow

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';

import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import DatePicker from 'material-ui/DatePicker';

import RaisedButton from 'material-ui/RaisedButton';
import FullWidthSection from './FullWidthSection';
import typography from 'material-ui/styles/typography';
import {cyan500, grey200, darkWhite} from 'material-ui/styles/colors';
import spacing from 'material-ui/styles/spacing';

import './App.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    handleTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    appBar() {
        const style = {
            position: 'fixed',
            top: 0
        };

        return (
            <div>
                <AppBar
                    title={process.env.REACT_APP_TITLE}
                    onLeftIconButtonTouchTap={this.handleTouchTap}
                    zDepth={0}
                    style={style}/>
            </div>
        );
    }

    introductionPanel() {
        const styles = {
            root: {
                backgroundColor: cyan500,
                textAlign: 'center',
                overflow: 'hidden'
            },
            h1: {
                color: darkWhite,
                fontWeight: typography.fontWeightLight,
                fontSize: 56,
            },
            h2: {
                fontSize: 24,
                lineHeight: '32px',
                paddingTop: 16,
                letterSpacing: 0,
            },
            button: {
                margin: '16px 32px 0px 32px',
            },
        };

        styles.h2 = Object.assign({}, styles.h1, styles.h2);

        return (
            <FullWidthSection useContent={true} style={styles.root}>
                <h1 style={styles.h1}>
                    {process.env.REACT_APP_TITLE}
                </h1>
                <h2 style={styles.h2}>
                    TODO
                </h2>
                <RaisedButton
                    label="Get started"
                    style={styles.button}
                />
            </FullWidthSection>
        );
    }

    render() {
        const styles = {
            h2: {
                fontSize: 20,
                lineHeight: '28px',
                paddingTop: 19,
                marginBottom: 13,
                letterSpacing: 0,
            },
            h3: {
                margin: 0,
                padding: 0,
                fontWeight: typography.fontWeightLight,
                fontSize: 22,
            },
            div: {
                paddingTop: spacing.desktopKeylineIncrement
            }
        };

        return (
            <MuiThemeProvider>
                <div id="app-container">
                    {this.appBar()}

                    <div style={styles.div}>
                        {this.introductionPanel()}
                    </div>

                    <div id="content-container">
                        <DatePicker hintText="Portrait Dialog" />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
