import styles from './styles.module.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      {`Ship ${year} © All rights reserved`}
    </footer>
  );
};

export default Footer;
