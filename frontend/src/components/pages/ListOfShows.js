// @flow

import React from 'react';
import moment from 'moment';
import 'moment/locale/de';
import { red500, grey50 } from 'material-ui/styles/colors';

import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import ShowPickerItem from '../showpicker/ShowPickerItem';

const DATES_PER_PAGE = 25;

class ListOfShows extends React.Component {

    state = {
        dates: null,
        loadingDatesFailed: false,

        productions: null,

        shows: {},
        page: 1,
    };

    componentDidMount() {
        this.loadDates();
        this.loadProductions();
    };

    loadDates() {
        fetch(`/api/shows/dates`, {
            accept: 'application/json',
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then(response => {
            const dates = Object.keys(response)
                .map(str => moment(str, 'YYYY-MM-DD'))
                .sort((a,b) => -a.diff(b));
            this.setState({ dates });
        }).catch(err => {
            console.log(err);
            this.setState({ loadingDatesFailed: true });
        });
    };

    loadProductions() {
        fetch(`/api/productions`, {
            accept: 'application/json',
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then(response => {
            const productions = response.map(item => {
                return {
                    start: moment(item.start, 'YYYY-MM-DD'),
                    end: moment(item.end, 'YYYY-MM-DD'),
                    location: item.location,
                    theater: item.theater,
                };
            });

            this.setState({ productions });
        }).catch(err => {
            console.log(`Loading productions failed with error = ${err}`);
        });
    };

    getSecondaryTextFor(date) {
        if (!this.state.productions) {
            return null;
        }

        const productions = this.state.productions.filter(
            production => production.start.isBefore(date) && production.end.isAfter(date)
        );

        if (productions.length === 1) {
            const [production] = productions;
            return `${production.location}, ${production.theater}`;
        }

        return productions
            .map(production => production.location)
            .join(', ');
    };

    onItemToggle = date => {
        const { shows } = this.state;

        const key = date.format('DD.MM.YYYY');
        if (shows[key]) {
            return;
        }

        const [day, month, year] = key.split(/\./);
        fetch(`/api/shows/${year}/${month}/${day}`, {
            accept: 'application/json',
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then(response => {
            this.setState({
                shows: Object.assign({}, shows, {
                    [key]: response
                })
            });
        }).catch(err => {
            this.setState({
                shows: Object.assign({}, shows, {
                    [key]: []
                })
            });
        });
    };

    renderAvatar(date) {
        return (
            <Avatar color={grey50} backgroundColor={red500}>
                {date.format('dddd').substr(0,2)}
            </Avatar>
        );
    };

    renderNestedItems(date) {
        const { shows } = this.state;
        const key = date.format('DD.MM.YYYY');
        if (typeof shows[key] === 'undefined') {
            return [(
                <ListItem key={`${key}-progress`} disabled={true} style={{ textAlign: 'center' }}>
                    <CircularProgress color={red500} />
                </ListItem>)];
        }

        if (shows[key].length === 0) {
            return [(<p>Ups! Es ist ein Fehler aufgetreten.</p>)];
        }

        return shows[key].map(show => {
            const [year, month, day] = show.day.split(/-/);
            return (
                <ShowPickerItem
                    key={`${key}-${show.time}-item`}
                    show={show}
                    selected={false}
                    displayDate={true}
                    onShowSelected={() => { this.props.history.push(`/shows/${show.location}/${day}/${month}/${year}/${show.time}`) }}
                />
            );
        });
    };

    renderItems() {
        const { dates, page } = this.state;

        return dates
            .slice((page - 1) * DATES_PER_PAGE, page * DATES_PER_PAGE)
            .map(date => {
                return (
                    <ListItem
                        key={date.format('DD.MM.YYYY')}
                        primaryText={date.format('DD.MM.YYYY')}
                        secondaryText={this.getSecondaryTextFor(date)}
                        leftAvatar={this.renderAvatar(date)}
                        initiallyOpen={false}
                        primaryTogglesNestedList={true}
                        nestedItems={this.renderNestedItems(date)}
                        onNestedListToggle={() => this.onItemToggle(date)}
                    />
                );
            });
    };

    renderList() {
        return (
            <Paper>
                <List>
                    {this.renderItems()}
                </List>
            </Paper>
        );
    };

    render() {
        const { dates, loadingDatesFailed, page } = this.state;
        if (loadingDatesFailed) {
            return (<p>Ups! Leider ist ein Fehler aufgetreten.</p>);
        }

        if (!dates) {
            return (<CircularProgress color={red500} size={80} />);
        }

        const styles = {
            root: {
                maxWidth: 400,
                margin: '0 auto',
                marginTop: '2em',
                marginBottom: '2em',
                textAlign: 'left',
            },
            actions: {
                marginTop: '1em',
                textAlign: 'center',
            },
        };

        const maxPage = Math.ceil(dates.length / DATES_PER_PAGE);
        return (
            <div style={styles.root}>
                {this.renderList()}

                <div style={styles.actions}>
                    <RaisedButton label="Zurück" onTouchTap={() => this.setState({ page: page - 1 })} disabled={page <= 1} />
                    <RaisedButton label="Weiter" onTouchTap={() => this.setState({ page: page + 1 })} disabled={page >= maxPage} />
                </div>
            </div>
        );
    };

}

export default ListOfShows;