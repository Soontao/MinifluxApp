import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { Virtuoso } from "react-virtuoso";
import { MinifluxClient } from "../api";
import { Entry, GetEntriesOptions } from "../api/miniflux";
import store, { appConnect } from "../store";

import * as React from "react";
import { RouteComponentProps } from "react-router";
import { fillContent } from "../store/features/content";

export interface IHomeProps extends RouteComponentProps {
  credential: {
    url: string;
    token: string;
  };
}

export interface IHomeState {
  entryCount: number;
  entries: Array<Entry>;
}

class Home extends React.Component<IHomeProps, IHomeState> {
  private _client: MinifluxClient;

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      entryCount: 0,
      entries: [],
    };
    this._client = new MinifluxClient(this.props.credential);
  }

  componentDidMount() {
    this._loadMore();
  }

  async _appendEntries(replace = false) {
    const options: GetEntriesOptions = {
      limit: 10,
      status: "unread",
      direction: "desc",
    };

    if (replace === false && this.state.entries.length > 0) {
      options.before_entry_id =
        this.state.entries[this.state.entries.length - 1].id;
    }

    const data = await this._client.entires(options);

    const entries =
      replace === true
        ? data.entries
        : [...this.state.entries, ...data.entries];

    this.setState({ entries, entryCount: data.total });
  }

  private async _loadMore() {
    if (this.state.entries.length > 0) {
      // TODO: send toast tell user those has been marked as read
      const entry_ids = this.state.entries
        .map((item) => item?.id)
        .filter((id) => id !== undefined) as any as Array<number>;
      await this._client.update({
        entry_ids,
        status: "read",
      });
    }
    await this._appendEntries();
  }

  private _buildCard(index: number, entry: Entry) {
    return (
      <IonCard
        onClick={(e) => {
          e.preventDefault();
          store.dispatch(fillContent({ entry }));
          this.props.history.push("/content");
        }}
      >
        <IonCardHeader>
          <IonCardTitle>{entry.title}</IonCardTitle>
          <IonCardSubtitle>{entry.author}</IonCardSubtitle>
        </IonCardHeader>
      </IonCard>
    );
  }

  _onRefresh(event: CustomEvent<RefresherEventDetail>) {
    this._appendEntries(true).finally(() => {
      event.detail.complete();
    });
  }

  public render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Miniflux</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={this._onRefresh.bind(this)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={this.state.entryCount}
            data={this.state.entries}
            itemContent={this._buildCard.bind(this)}
            endReached={this._loadMore.bind(this)}
          ></Virtuoso>
        </IonContent>
      </IonPage>
    );
  }
}

export default appConnect((state) => ({
  credential: state.userReducer.credential,
}))(Home);
