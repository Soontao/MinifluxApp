import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { MinifluxClient } from "../api";
import { Entry, GetEntriesOptions } from "../api/miniflux";
import store, { appConnect } from "../store";

import * as React from "react";
import { RouteComponentProps } from "react-router";
import { fillContent } from "../store/features/content";
import { getImageLink } from "../utils/getImageLink";

export interface IHomeProps extends RouteComponentProps {
  credential: {
    url: string;
    token: string;
  };
}

export interface IHomeState {
  entryCount: number;
  entries: Array<Entry>;
  markedIds: Array<number>;
}

class Home extends React.Component<IHomeProps, IHomeState> {
  private _client: MinifluxClient;

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      entryCount: 0,
      entries: [],
      markedIds: [],
    };
    this._client = new MinifluxClient(this.props.credential);
  }

  componentDidMount() {
    this._loadMore();
  }

  async _appendEntries(replace = false) {
    const options: GetEntriesOptions = {
      limit: 15,
      status: "unread",
      direction: "desc",
    };

    if (replace === false && this.state.entries.length > 0) {
      options.before_entry_id =
        this.state.entries[this.state.entries.length - 1].id;
    }

    const data = await this._client.entires(options);
    const newEntries = data.entries;
    const entries =
      replace === true ? newEntries : [...this.state.entries, ...newEntries];

    this.setState({ entries, entryCount: data.total });
  }

  private async _loadMore() {
    if (this.state.entries.length > 0) {
      // TODO: send toast tell user those has been marked as read
      const entry_ids = this.state.entries
        .filter((item) => !this.state.markedIds.includes(item.id))
        .map((item) => item?.id)
        .filter((id) => id !== undefined) as any as Array<number>;
      this.setState({ markedIds: [...this.state.markedIds, ...entry_ids] });
      await this._client.update({ entry_ids, status: "read" });
    }
    await this._appendEntries();
  }

  private _buildCard(index: number, entry: Entry) {
    return (
      <IonCard
        key={entry.id}
        onClick={(e) => {
          e.preventDefault();
          store.dispatch(fillContent({ entry }));
          this.props.history.push("/content");
        }}
      >
        <IonImg
          src={getImageLink(entry.content)}
          onIonError={(e) => {
            e.target.remove();
          }}
        ></IonImg>
        <IonCardHeader>
          <IonCardTitle>{entry.title}</IonCardTitle>
          <IonCardSubtitle>{entry.author}</IonCardSubtitle>
        </IonCardHeader>
      </IonCard>
    );
  }

  private _onRefresh(event: CustomEvent<RefresherEventDetail>) {
    this._appendEntries(true).finally(() => {
      event.detail.complete();
    });
  }

  public render() {
    return (
      <IonPage>
        <IonHeader translucent>
          <IonToolbar>
            <IonTitle>Miniflux</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={this._onRefresh.bind(this)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Miniflux</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList>
            {this.state.entries.map((entry, index) =>
              this._buildCard(index, entry)
            )}
          </IonList>
          <IonInfiniteScroll
            onIonInfinite={(ev) => {
              this._loadMore().finally(() => ev.target.complete());
            }}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonPage>
    );
  }
}

export default appConnect((state) => ({
  credential: state.userReducer.credential,
}))(Home);
