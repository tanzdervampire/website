// @flow

import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red500, grey900, lightWhite, white } from 'material-ui/styles/colors';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FullWidthSection from './FullWidthSection';
import GithubIcon from './components/GithubIcon';

import SearchCastByDate from './components/pages/SearchCastByDate';

/* See http://stackoverflow.com/questions/37400648/cant-style-datepiker-popup-dialog */
const muiTheme = getMuiTheme({
    datePicker: {
        color: red500,
        selectColor: red500,
    },
    flatButton: {
        primaryTextColor: red500,
    },
});

class App extends React.Component {

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
                showMenuIconButton={false}
                iconElementRight={
                    <IconButton href="https://github.com/tdv-casts/">
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
                    <IconButton href="https://github.com/tdv-casts/">
                        <GithubIcon color={white} />
                    </IconButton>
                </div>
            </FullWidthSection>
        );
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    {this.appBar()}

                    <SearchCastByDate />

                    {this.footer()}
                </div>
            </MuiThemeProvider>
        );
    };

}

export default App;