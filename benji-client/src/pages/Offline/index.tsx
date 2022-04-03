import classes from "./Offline.module.css";
import { ReactComponent as Background } from "../../assets/Background.svg";
import { ReactComponent as Logo } from "../../assets/Logo.svg";

const OfflinePage = () => {
  return (
    <div className={classes.offline_container}>
      <Background className={classes.background} />
      <header>
        <Logo />
        <h1>Benji.</h1>
      </header>
      <section className={classes.offline__body}>
        <h2>It seems Benji is currently offline :(</h2>
        <p>Please check again later</p>
        <img
          src="https://c.tenor.com/2iN19BT6ZcIAAAAd/suicide-pigeon-jumps-off-building-pigeon.gif"
          alt="sad-pigeon.gif"
        />
      </section>
    </div>
  );
};

export default OfflinePage;
