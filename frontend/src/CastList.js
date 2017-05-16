// @flow

import React from 'react';
import PropTypes from 'prop-types';

import {lightWhite} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

class CastList extends React.Component {

    static propTypes = {
        /* The date on which the show was. */
        date: PropTypes.instanceOf(Date).isRequired,

        /* Where the show was. */
        place: PropTypes.string.isRequired,

        /* Which show of the day. Can be a time, e.g., "14:30 Uhr", or something like "Matinée". */
        time: PropTypes.string.isRequired,

        /* The cast list. */
        cast: PropTypes.object.isRequired,
    };

    // TODO Dummy data, remove it.
    static defaultProps = {
        date: new Date(),
        place: "Stuttgart",
        time: "Matinée",
        cast: {
            "Graf von Krolock": [
                "Felix Martin"
            ],
            "Alfred": [
                "Max Niemeyer"
            ],
            "Professor Abronsius": [
                "Stefan Poslovski"
            ],
            "Sarah": [
                "Henriette Grawwert"
            ],
            "Chagal": [
                "Jerzy Jeszke"
            ],
            "Magda": [
                "Franziska Forster"
            ],
            "Rebecca": [
                "Simone Pohl"
            ],
            "Herbert": [
                "Tim Reichwein"
            ],
            "Koukol": [
                "Stefan Büdenbender"
            ],
            "Solotänzer": [
                "Peter Horemans",
                "Kevin Foster",
                "Silvano Marraffa",
                "Leigh-Anne Vizer",
                "Kerstin Zwanzig"
            ],
            "Gesangsensemble": [
                "Paul Walthaus",
                "Alexander di Capri",
                "Michel Driesse",
                "Manuel Stoff",
                "Veit Schäfermeier",
                "Paul Erkamp",
                "Kati Heidebrecht",
                "Lillemor Spitzer",
                "Katrin Löbbert",
                "Femke Soetenga",
                "Stephanie H. Tschöppe",
                "Sonja Schatz"
            ],
            "Tanzensemble": [
                "Leigh-Anne Vizer",
                "Kerstin Zwanzig",
                "Peter Horemans",
                "Kevin Foster",
                "Silvano Marraffa",
                "Daniel Ruiz",
                "Phillip Kempster",
                "Michael Eckel",
                "Silvia Lambertoni",
                "Maria Anna Russo",
                "Kym Boyson",
                "Kelly Edwards"
            ],
            "Dirigent": [
                "Carsten Paap"
            ]
        },
    };

    createDivider(group) {
        const key = "divider-" + group;

        return (
            <Subheader
                key={key}
            >
                {group}
            </Subheader>
        );
    }

    createItem(role, actor) {
        const key = actor + Math.random();

        return (
            <ListItem
                key={key}
                disabled={true}
                primaryText={actor}
                secondaryText={role}
                leftAvatar={<Avatar src="images/avatar.jpg" />}
            />
        );
    }

    createItems() {
        const { cast } = this.props;
        let items = [];

        // TODO Deal with undefineds
        items.push(this.createDivider("Hauptrollen"));
        items.push(this.createItem("Graf von Krolock", cast["Graf von Krolock"][0]));
        items.push(this.createItem("Alfred", cast["Alfred"][0]));
        items.push(this.createItem("Professor Abronsius", cast["Professor Abronsius"][0]));
        items.push(this.createItem("Sarah", cast["Sarah"][0]));
        items.push(this.createItem("Chagal", cast["Chagal"][0]));
        items.push(this.createItem("Magda", cast["Magda"][0]));
        items.push(this.createItem("Rebecca", cast["Rebecca"][0]));
        items.push(this.createItem("Herbert", cast["Herbert"][0]));
        items.push(this.createItem("Koukol", cast["Koukol"][0]));

        if(typeof cast["Solotänzer"] !== "undefined") {
            items.push(this.createDivider("Solotänzer"));
            items = items.concat(cast["Solotänzer"].map((actor) => {
                return this.createItem("Solotänzer", actor);
            }));
        }

        if(typeof cast["Gesangsensemble"] !== "undefined") {
            items.push(this.createDivider("Gesangsensemble"));
            items = items.concat(cast["Gesangsensemble"].map((actor) => {
                return this.createItem("Gesangsensemble", actor);
            }));
        }

        if(typeof cast["Tanzensemble"] !== "undefined") {
            items.push(this.createDivider("Tanzensemble"));
            items = items.concat(cast["Tanzensemble"].map((actor) => {
                return this.createItem("Tanzensemble", actor);
            }));
        }

        if(typeof cast["Dirigent"] !== "undefined") {
            items.push(this.createDivider("Dirigent"));
            items.push(this.createItem("Dirigent", cast["Dirigent"][0]));
        }

        return items;
    }

    // TODO Doesn't deal well with little space. Find a better way.
    createHeader() {
        let format = new global.Intl.DateTimeFormat("de-DE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format;

        const { date, place, time } = this.props;
        let title = [format(date), place, time].join(", ");

        return (
            <Toolbar>
                <ToolbarGroup>
                    <IconButton>
                        <KeyboardArrowLeft />
                    </IconButton>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarTitle text={title} />
                </ToolbarGroup>
                <ToolbarGroup>
                    <IconButton>
                        <KeyboardArrowRight />
                    </IconButton>
                </ToolbarGroup>
            </Toolbar>
        );
    }

    render() {
        const styles = {
            content: {
                backgroundColor: lightWhite,
                padding: "1em 0",
            },
            header: {
                padding: 10,
                marginBottom: 10,
            },
            listContainer: {
                maxWidth: 700,
                textAlign: "left",
                position: "relative",
                margin: "0 auto",
            },
        };

        return (
            <div style={styles.content}>
                <div style={styles.listContainer}>
                    <Paper>
                        {this.createHeader()}

                        <List>
                            {this.createItems()}
                        </List>
                    </Paper>
                </div>
            </div>
        );
    }

}

export default CastList;