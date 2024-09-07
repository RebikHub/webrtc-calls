import { initApp } from "crs-arch";
import { Layout } from "./layout/Layout";
import './styles/main.css';
import { router } from "./router/router";

initApp('root', [Layout])

router.start()