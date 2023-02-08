import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Connexion from '../Connexion/connexion.jsx';
import Logo from '../../assets/img/fatboar_logo.png';
import './cgu.scss';

class ForgotenPwd extends Component {
    componentDidMount(){
        var head;
        var payload ;
        var signature;
        var tok;
        if(localStorage.getItem('payload')){
              head =  localStorage.getItem('head');
              payload =  localStorage.getItem('payload');
              signature =  localStorage.getItem('signature');
              tok = head + '.' + payload + '.' + signature;
        }else{
              head =  localStorage.getItem('auth_head');
              payload =  localStorage.getItem('auth_payload');
              signature =  localStorage.getItem('auth_signature');
              tok = head + '.' + payload + '.' + signature;
              tok = tok.substr(6);
        }
        if(head === null && payload === null && signature ===null){
            console.log("tok", tok);
        }
    }
    render(){
        return( 
            <div id="cgu">
                    <a className="nav-title" href="/">
                        <img
                            id="logo-header"
                            alt="logo"
                            src={Logo}
                            title="logo fatbor header admin"
                        />
                    </a>
                <section className="cgu">
                        <br></br> 
                        <br></br>
                        <h2 className="text-center h2-cgu">Conditions générales d'utilisation du site</h2>
                        <div className="mt-n1 mb-n1">
                            <h3>Société</h3>
                            <p>FuriousDucks SA au capital 100 000 €.</p>
                        </div>
                        <div className="mt-n1 mb-n1">
                            <h3>Siège</h3>
                            <p>170 Rue de Courcelles, 75017 Paris - France
                                Téléphone : 01 83 05 22 47
                            </p>
                            <p>Directeur de la publication : Carlos Olmedo en qualité de représentant</p>
                        </div>
                        <div className="mt-n1 mb-n1">
                            <h3>Déclaration</h3>
                            <p>
                                FuriousDucks est une agence web, déclaration enregistrée sous le numéro 82 69 11894 69
                                auprès du préfet de la région Île-de-France.
                            </p>
                            <ul>
                                <li>Numéro de déclaration à la CNIL : 1162303</li>
                                <li>Numéro SIREN : 48806573100025</li>
                                <li>Numéro RCS : 488 065 731</li>
                                <li>Code AliE : 6201Z</li>
                                <li>Numéro de TVA : FR53488065731</li>
                            </ul>
                        </div>
                        <div className="mt-n1 mb-n1">
                            <h3>Mentions Légales Hébergeur</h3>
                            <h5>1. Adresse Postale</h5>
                            <p>ONLINE SAS</p>
                            <p>BP 438 75366 PARIS CEDEX 08</p>

                            <h5>2. Contact</h5>
                            <p>
                                Vous pouvez joindre notre service clientèle par téléphone 24h/24, 7j/7 au +33 (0)899 173
                                788 (appel non surtaxé) ou via notre formulaire de contact https://www.online.net/
                            </p>
                            <p>SAS au capital de 214 410,50 euros</p>
                            <p>RCS Sarreguemines B 431 303 775</p>

                            <h5>3. Vue d’ensemble</h5>
                            <p>
                                Ce site web est exploité par FuriousDucks. Sur ce site, les termes «nous», «notre» et «nos»
                                font référence à FuriousDucks. FuriousDucks propose ce site web, y compris toutes les in-
                                formations, tous les outils et tous les services qui y sont disponibles pour vous, l’utilisateur,
                                sous réserve de votre acceptation de l’ensemble des modalités, conditions, politiques et avis
                                énoncés ici.
                            </p>
                            <p>
                                En visitant ce site et/ou en achetant un de nos produits, vous vous engagez dans notre
                                «Service» et acceptez d’être lié aux conditions et politiques additionnelles auxquelles il est
                                fait référence ici et/ou accessibles par hyperlien. Ces conditions d’utilisation s’appliquent
                                à tous les utilisateurs de ce site, incluant mais ne se limitant pas, aux utilisateurs qui na-
                                viguent sur le site, qui sont des vendeurs, des clients, des marchands, et/ou des contribu-
                                teurs de contenu.
                            </p>
                            <h5>4. Propriété intellectuelle</h5>
                            <p>
                                La structure générale, ainsi que les logiciels, textes, photos, images animées ou non, sons,
                                savoir-faire, dessins, graphismes et tous autres éléments composants le site sont la pro-
                                priété exclusive de l’agence FuriousDucks. Les utilisateurs du présent site sont tenus de
                                respecter les dispositions de la loi relative à l’Informatique, aux fichiers et aux libertés, dont
                                la violation est passible de sanctions pénales. Toute représentation totale ou partielle de ce
                                site par quelque procédé que ce soit, sans l’autorisation expresse de l’éditeur est interdite
                                et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de
                                la propriété intellectuelle. Il en est de même des bases de données figurant sur le site web,
                                qui sont protégées par les dispositions de la loi du 1er juillet 1998 portant transposition
                                dans le Code de la propriété intellectuelle de la directive européenne du 11 mars 1996 re-
                                lative à la protection juridique des bases de données. L’identité visuelle de l’agence Furious-
                                Ducks ainsi que les logos des marques figurant sur le site sont des marques déposées ou
                                sont la propriété de ses partenaires. Toute reproduction totale ou partielle de ces marques
                                ou de ces logos, effectuée à partir des éléments du site sans l’autorisation expresse de
                                l’agence FuriousDucks est donc prohibée, au sens de l’article L.713-2 du Code de la proprié-
                                té intellectuelle.
                            </p>
                            <h5>5. Contenu éditorial</h5>
                            <p>
                                Le site s’efforce d’assurer l’exactitude et la mise à jour des informations diffusées et décline
                                toute responsabilité pour toute imprécision, inexactitude ou omission ainsi que pour tous
                                dommages résultant d’une introduction frauduleuse d’un tiers ayant entraîné une modifi-
                                cation des informations mises à disposition. Le contenu éditorial du site est à but informatif
                                et non contractuel et peut être modifié, sans recours ni préavis. L’éditeur s’engage à mettre
                                tous les moyens humains, techniques et financiers pour assurer la fiabilité des annonces /137
                                147publiées sur le site. Il ne peut en aucun cas être tenu pour responsable pour toute erreur,
                                omission, inexactitude, indisponibilité ou défaut d’affichage de ces dernières. Ces informa-
                                tions ne constituent en aucun cas une assertion, une garantie ou un quelconque engage-
                                ment de la part l’éditeur.
                            </p>
                            <h5>6. Conditions de participation</h5>
                            <p>
                                Ce jeu est ouvert à toute personne physique majeure résidant dans l'Union Européenne.
                                L’association se réservant le droit de procéder à toutes les vérifications nécessaires concernant l’identité, l’adresse postale et / ou électronique des participants. 
                                Sont exclus de toute participation au présent jeu et du bénéfice de toute dotation, que ce soit directement ou indirectement l’ensemble du personnel de la Société et du Partenaire, y compris leur famille et conjoints (mariage, P.A.C.S. ou vie maritale reconnue ou non). 
                                Les personnes n’ayant pas justifié de leurs coordonnées et identités complètes ou qui les auront fournies de façon inexacte ou mensongère seront disqualifiées, tout comme les personnes refusant les collectes, enregistrements et utilisations des informations à caractère nominatif les concernant et strictement nécessaires pour les besoins de la gestion des jeux. 
                                La participation au jeu implique pour tout participant l'acceptation entière et sans réserve du présent règlement. Le non-respect dudit règlement entraîne l’annulation automatique de la participation et de l'attribution éventuelle de gratifications.
                            </p>
                            <h5>7. Droits et devoirs de l’utilisateur</h5>
                            <p>
                                L’utilisateur du présent site reconnaît disposer de la compétence des moyens nécessaires
                                pour accéder à ce site, l’utiliser et avoir vérifié que la configuration informatique utilisée ne
                                contient aucun virus et qu’elle est en parfait état de fonctionnement. L’utilisateur est infor-
                                mé que lors de ses visites, le site collecte des informations destinées à l’établissement de
                                statistiques de trafic. Un cookie peut s’installer automatiquement sur son logiciel de navi-
                                gation Le cookie est un bloc de données qui ne permet pas de l’identifier mais qui sert à
                                enregistrer des informations relatives à la navigation de celui-ci sur le site. La collecte d’in-
                                formations personnelles sur le site s’effectue en conformité avec la loi n°78-17 du 6 janvier
                                1978 relative à l’informatique, aux fichiers et aux libertés. Conformément aux lois en vigueur
                                l’utilisateur dispose d’un droit d’accès, de rectification ou de suppression aux données per-
                                sonnelles le concernant en contactant l’éditeur du site.
                            </p>
                            <h5>8. Liens hypertextes</h5>
                            <p>
                                Les liens hypertextes mis en place dans le cadre du site Internet en direction d’autres res-
                                sources présentes sur le réseau Internet ont fait l’objet d’une autorisation préalable, ex-
                                presse et écrite. Les utilisateurs du site Internet ne peuvent mettre en place un lien hyper-
                                texte en direction du site sans l’autorisation expresse, écrite et préalable de l’éditeur.
                            </p>

                            <h5>9. Disponibilité des services</h5>
                            <p>
                                L’éditeur est tenu par une obligation de moyens en termes d’accessibilité de service et met
                                en place tous les moyens nécessaires pour rendre le site accessible 7 jours sur 7 et 24
                                heures sur 24. Il peut néanmoins suspendre l’accès au site sans préavis, notamment pour
                                des raisons de maintenance et de mises à niveau et il ne peut en aucun cas être tenu pour
                                responsable des éventuels préjudices qui peuvent en découler.
                            </p>
                            <h5>10. Droit applicable</h5>
                            <p>Les présentes sont soumises au droit français.</p>
                        </div>
                </section>
            </div>
        )
    }
}
export default ForgotenPwd;
