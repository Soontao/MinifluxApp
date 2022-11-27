import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Virtuoso } from "react-virtuoso";
import { MinifluxClient } from "../api";
import { Entry, GetEntriesOptions } from "../api/miniflux";
import { appConnect } from "../store";
import brokenImage from "../../public/assets/broken-1.png";

import * as React from "react";
import { getImageLink } from "../utils/getImageLink";

export interface IHomeProps {
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

  async _appendEntries() {
    const options: GetEntriesOptions = {
      limit: 10,
      status: "unread",
      direction: "desc",
    };
    if (this.state.entries.length > 0) {
      options.before_entry_id =
        this.state.entries[this.state.entries.length - 1].id;
    }
    const data = await this._client.entires(options);
    const entries = [...this.state.entries, ...data.entries];
    this.setState({ entries, entryCount: data.total });
  }

  private async _loadMore() {
    if (this.state.entries.length > 0) {
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
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{entry.title}</IonCardTitle>
          <IonCardSubtitle>{entry.author}</IonCardSubtitle>
        </IonCardHeader>
        <IonButtons>
          <IonButton fill="clear">Open</IonButton>
          <IonButton fill="clear">Save</IonButton>
        </IonButtons>
      </IonCard>
    );
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
