<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:nadia="html://nadia.org"
    xpath-default-namespace="http://www.tei-c.org/ns/1.0" xmlns="http://www.w3.org/1999/xhtml"
    version="2.0">
    
    <xsl:template match="/nadia:textos">
        <html>
            <head>
                <meta charset="UTF-8"/>
                <meta name="description" content="Descripció"/>
                <meta name="keywords" content="paraules clau"/>
                <meta name="author" content="Nom de l'autor"/>
                <script src="js/jquery-2.1.4.min.js"></script>
                <script src="js/jquery.tooltipster.min.js"></script>
                <script src="js/d3.min.js" charset="utf-8"></script>
                <script src="js/mapa1.js"></script>
                <script src="js/script.js"></script>
                <link rel="stylesheet" type="text/css" href="css/tooltipster.css" />
                <link rel="stylesheet" type="text/css" href="css/tooltipster-shadow.css" />
                <link rel="stylesheet" href="font-awesome-4.4.0/css/font-awesome.min.css"/>
                <link rel="stylesheet" type="text/css" href="css/estilo.css"/>
                
                <title><xsl:apply-templates select="@title"/></title>
            </head>
            <body>
                <div id="datosVersiones">
                    <xsl:call-template name="versiones" />
                </div>
                <header id="page-header"></header>
                <nav id="navPrincipal">
                    <a id="btnBuscar" class="menu-red buttonUp"><i class="fa fa-search"></i><span>Buscar</span></a>
                    <a id="btnAnalisis" class="menu-red buttonUp"><i class="fa fa-bar-chart"></i><span>Análisis</span></a>
                </nav>
                <h1><xsl:apply-templates select="@title"/></h1>
                      
               <button id="btnAnadir" class="fa fa-plus" />
                <xsl:apply-templates />
                
                <div id="divFondo">
                    <div id="divBusqueda">
                        <p class="pIconoCerrar">    
                            <i id="iconoResultadosCerrar" class="fa fa-times"></i>
                        </p>
                        <p id="pBuscador">
                            <input type="text" id="textoBuscar" width="25" placeholder="texto de búsqueda"/>
                            <i id="iconoBuscar" class="fa fa-search"></i>
                            <i id="iconoBorrar" class="fa fa-refresh"></i>
                        </p>
                        <h3 id="tituloResultadosBusqueda">Resultados de Búsqueda:</h3>
                         <div id="tablaBusquedaWrapper">
                            <table id="tablaBusqueda"/>
                         </div>
                    </div>
                    <div id="divAnalisis">
						<p class="pIconoCerrar">    
                            <i id="iconoAnalisisCerrar" class="fa fa-times"></i>
                        </p>
                        <h3>Análisis</h3>
                        <!-- Aquí se añadirá el p con los botones de análisis -->
                    </div>
                    <div id="divImagenes">
                        <p class="pIconoCerrar">    
                            <i id="iconoImagenesCerrar" class="fa fa-times"></i>
                        </p>
                        <div id="carrusel">
                            <span style="display: block;" class="carrusel-prev">
                                <span class="carrusel-prevIcon"></span>
                            </span>
                            <div id="carrusel-imagenes">
                            </div>
                            <span style="display: block;" class="carrusel-next">
                                <span class="carrusel-nextIcon"></span>
                            </span>
                            <p id="carrusel_desc"></p>
                        </div>
                  </div>
                </div>
                <footer>La Estrella de Sevilla. Edición digital.</footer>
            </body>
        </html>
    </xsl:template>
    
    <xsl:template name="versiones">
        {"versiones":[
        <xsl:for-each select="nadia:texto/nadia:version">
            {"id":"<xsl:value-of select="@id"/>", "nombre":"<xsl:value-of select="@nombre"/>"}, 
        </xsl:for-each> 
            {"id":"", "nombre":""}
        ]}
    </xsl:template>
    
  
    <xsl:template match="docAuthor" />
        
    
    <xsl:template match="nadia:texto">
        <xsl:apply-templates>
            <xsl:with-param name="srcTexto" select="@src"/>
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="nadia:version">
        <xsl:param name="srcTexto" />
        <xsl:element name="div">
            <xsl:attribute name="class" select="'version'"></xsl:attribute>
            <xsl:attribute name="id" select="concat('version-',@id)"></xsl:attribute>
                <xsl:apply-templates select="document($srcTexto)">
                    <xsl:with-param name="listWitId" select="@id" />
                </xsl:apply-templates>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="teiHeader" />
    
    <xsl:template match="text">
        <xsl:param name = "listWitId" />
        <xsl:apply-templates>
            <xsl:with-param name="listWitId" select = "$listWitId" />
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="body">
        <xsl:param name = "listWitId" />
        <xsl:apply-templates>
            <xsl:with-param name="listWitId" select = "$listWitId" />
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="div[@type='jornada']">
        <xsl:param name = "listWitId" />
        <div class="jornada" id="{concat($listWitId,'_', @n)}">
            <xsl:apply-templates>
                <xsl:with-param name="listWitId" select = "$listWitId" />
            </xsl:apply-templates>
        </div>
    </xsl:template>
    
    
    <xsl:template match="head" >
        <xsl:param name = "listWitId" />
        <p class="jornada">
            <xsl:apply-templates>
                <xsl:with-param name="listWitId" select = "$listWitId" />
            </xsl:apply-templates>
        </p>
    </xsl:template>
    
    
    <xsl:template match="div">
        <xsl:param name = "listWitId" />
        <xsl:apply-templates>
            <xsl:with-param name="listWitId" select = "$listWitId" />
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="castList">
        <xsl:param name = "listWitId" />
        <ul version="{$listWitId}">
            <xsl:apply-templates select="castItem">
                <xsl:with-param name="listWitId" select = "$listWitId" />
            </xsl:apply-templates>
        </ul>
    </xsl:template>
    
    <xsl:template match="castItem">
        <xsl:param name = "listWitId" />
        <li class="cast">
            <xsl:apply-templates>
                <xsl:with-param name="listWitId" select = "$listWitId" />
            </xsl:apply-templates>
        </li>
    </xsl:template>
    
    <xsl:template match="castItem">
        <xsl:param name = "listWitId" />
        <li class="cast">
            <xsl:apply-templates>
                <xsl:with-param name="listWitId" select = "$listWitId" />
            </xsl:apply-templates>
        </li>
    </xsl:template>
    
    <xsl:template match="note">
        <xsl:param name = "listWitId" />
        <xsl:if test="$listWitId='nrg'">
        <xsl:if test="@type='comentario'">
            <xsl:element name="span">
                <xsl:attribute name="class">nota comentario tooltip</xsl:attribute>
                <xsl:attribute name="title"><xsl:apply-templates /></xsl:attribute>
                <i class="fa fa-comment"></i>
            </xsl:element>
        </xsl:if>
            <xsl:if test="@type='video'">
                <xsl:element name="span">
                    <xsl:attribute name="class">nota video tooltip</xsl:attribute>
                    <xsl:attribute name="title"><xsl:apply-templates /></xsl:attribute>
                    <xsl:attribute name="data-video"><xsl:value-of select="@source"/></xsl:attribute>
                    <i class="fa fa-video-camera"></i>
                </xsl:element>
            </xsl:if>
            <xsl:if test="@type='vocabulario'">
            <xsl:element name="span">
                <xsl:attribute name="class">nota vocabulario tooltip</xsl:attribute>
                <xsl:attribute name="title"><xsl:apply-templates /></xsl:attribute>
                <i class="fa fa-question-circle"></i>
            </xsl:element>
        </xsl:if>
            <xsl:if test="@type='critica'">
                <xsl:element name="span">
                    <xsl:attribute name="class">nota critica tooltip</xsl:attribute>
                    <xsl:attribute name="title"><xsl:apply-templates /></xsl:attribute>
                    <i class="fa fa-commenting-o"></i>
                </xsl:element>
            </xsl:if>
        <xsl:if test="@type='imagen'">
            <xsl:element name="span">
                <xsl:attribute name="class">nota imagen </xsl:attribute>
                <span class="imagenes"><xsl:apply-templates /></span>
                     <xsl:for-each select="figure">
                         <span class="carrusel_desc"><i><xsl:value-of select="head"/>:</i><xsl:value-of select="figDesc"/></span>
                       </xsl:for-each>
                    
                  
                <i class="fa fa-camera-retro"></i>
            </xsl:element>
        </xsl:if>
        </xsl:if>
     </xsl:template>
    
    <xsl:template match="note[@type='imagen']/figure">
        <img class="pg-imagen">
 
            <xsl:attribute name="src"><xsl:value-of select="concat('img/',graphic/@url)" /></xsl:attribute>
        </img>
    </xsl:template>
    
    <xsl:template name="descripcionImagenes">
        <span class="carrusel_desc">
            <i><xsl:value-of select="head" /></i>
        </span>
    </xsl:template>
    

    <xsl:template match="role">
        <xsl:param name = "listWitId" />
        <xsl:apply-templates>
            <xsl:with-param name="listWitId" select = "$listWitId" />
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="//app">
        <xsl:param name = "listWitId" />

    
                        <xsl:choose>
                            <xsl:when test="$listWitId='nrg'">

                                <span class="diferencia">

                                    <xsl:apply-templates >
                                        <xsl:with-param name="listWitId" select = "$listWitId" />
                                    </xsl:apply-templates>
                                    <span>
                                        <xsl:attribute name="class">diferencia tooltip <xsl:value-of select="$listWitId"/></xsl:attribute>
                                        <xsl:attribute name="title">
                                            <xsl:value-of>
                                s#Suelta:# <xsl:value-of select="./rdg[tokenize(@wit, '\s')='#s']"/>##
                                d#Desglosada:# <xsl:value-of select="./rdg[tokenize(@wit, '\s')='#d']"/>##
                                <xsl:if test="normalize-space(./rdg[tokenize(@wit, '\s')='#f'] )!= '' ">f#Foulché:# <xsl:value-of select="./rdg[tokenize(@wit, '\s')='#f']"/>##</xsl:if>
                                <xsl:if test="normalize-space(./rdg[tokenize(@wit, '\s')='#o']) != '' ">o#Orellana:# <xsl:value-of select="./rdg[tokenize(@wit, '\s')='#o']"/>##</xsl:if>
                                <xsl:if test="normalize-space(./rdg[tokenize(@wit, '\s')='#hart']) != '' ">hart#Hartzenbusch:# <xsl:value-of select="./rdg[tokenize(@wit, '\s')='#hart']"/>##</xsl:if>
                    </xsl:value-of>
                    </xsl:attribute>
        <i class="fa fa-tag"></i>
        </span>
        </span>
                            </xsl:when>
                            <xsl:otherwise>
                            <xsl:value-of select="./rdg[contains(@wit,$listWitId)]"/>
                            </xsl:otherwise>
                        </xsl:choose>
    </xsl:template>
    

    <xsl:template match="rdg">
        <xsl:param name = "listWitId" />
        <xsl:choose>
            <xsl:when test="contains(@wit,$listWitId)">
                <xsl:apply-templates>
                    <xsl:with-param name="listWitId" select = "$listWitId" />
                </xsl:apply-templates>
            </xsl:when>
        </xsl:choose>
    </xsl:template>
    

    <xsl:template match="hi[@rend='bold']">
        &lt;strong&gt;<xsl:apply-templates />&lt;/strong&gt; 
    </xsl:template>
    <xsl:template match="hi[@rend='italic']">
        &lt;em&gt;<xsl:apply-templates />&lt;/em&gt; 
    </xsl:template>
    
    
    <xsl:template match="sp">
        <xsl:param name = "listWitId" />
        <xsl:apply-templates>
            <xsl:with-param name="listWitId" select = "$listWitId" />
            <xsl:with-param name="spwho" select = "@who" />
            <xsl:with-param name="speaker" select = "speaker" />
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="speaker">
        <xsl:param name = "listWitId" />
        <xsl:choose>
            <xsl:when test="app">
                <p class="speaker speaker_1">
                    <xsl:apply-templates>
                        <xsl:with-param name="listWitId" select = "$listWitId" />
                    </xsl:apply-templates>
                </p>
            </xsl:when>
            <xsl:otherwise>
                <p class="speaker speaker_1">
                    <xsl:apply-templates>
                        <xsl:with-param name="listWitId" select = "$listWitId" />
                    </xsl:apply-templates>
                </p>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="lg">
        <xsl:param name = "listWitId" />
        <xsl:apply-templates>
            <xsl:with-param name="listWitId" select = "$listWitId" />
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="l">
        <xsl:param name = "listWitId" />
        <xsl:param name = "spwho" />
        <xsl:param name = "speaker" />
        <xsl:choose>
            <xsl:when test="app">
                <xsl:choose>
                    <xsl:when test="./app/rdg and ./app/rdg[@wit=$listWitId]=''">
                        <xsl:apply-templates/>
                    </xsl:when>
                    <xsl:otherwise>

                        <xsl:call-template name="verso">
                            <xsl:with-param name="listWitId" select = "$listWitId" />
                        </xsl:call-template> 
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="verso">
                    <xsl:with-param name="listWitId" select = "$listWitId" />
                </xsl:call-template> 
            </xsl:otherwise>
        </xsl:choose>
        <br/>
    </xsl:template>
    
    <xsl:template match="p">
        <xsl:param name = "listWitId" />
        <xsl:param name = "spwho" />
        <xsl:param name = "speaker" />
        <xsl:choose>
            <xsl:when test="app">
                <xsl:choose>
                    <xsl:when test="./app/rdg and ./app/rdg[@wit=$listWitId]=''">
                        <xsl:apply-templates/>
                    </xsl:when>
                    <xsl:otherwise>

                        <xsl:call-template name="prosa">
                            <xsl:with-param name="listWitId" select = "$listWitId" />
                        </xsl:call-template> 
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="prosa">
                    <xsl:with-param name="listWitId" select = "$listWitId" />
                </xsl:call-template> 
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    
    <xsl:template match="stage">
        <xsl:param name = "listWitId" />
        <div class="stage stage_1">
            <i>
                <xsl:apply-templates>
                    <xsl:with-param name="listWitId" select = "$listWitId" />
                </xsl:apply-templates>
            </i>
        </div>
    </xsl:template>
    
    <xsl:template name="prosa">
        <xsl:param name = "listWitId" />
            <xsl:element name="p">
                            <xsl:attribute name="class">
                                <xsl:value-of select="concat('prosa prosa_1 ', substring($listWitId,2,string-length($listWitId)))"/>
                            </xsl:attribute>
                            <xsl:apply-templates>
                                <xsl:with-param name="listWitId" select = "$listWitId" />
                            </xsl:apply-templates>
                        </xsl:element>
        <br/>
    </xsl:template>
    

    <xsl:template name="verso">
        <xsl:param name = "listWitId" />
        <p class="numVerso numVerso_1">&#160;</p>
        <xsl:choose>
            <xsl:when test="not(preceding-sibling::*[1]) and (./ancestor::*[@part='I'] or not(./ancestor::*[@part]))">
                <xsl:call-template name="versoSangrado">
                    <xsl:with-param name="listWitId" select = "$listWitId" />
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:choose>
                    <xsl:when test="@part='F'">
                        <xsl:call-template name="versoFinal">
                            <xsl:with-param name="listWitId" select = "$listWitId" />
                        </xsl:call-template>
                    </xsl:when>
                    <xsl:when test="@part='M'">
                        <xsl:call-template name="versoMedio">
                            <xsl:with-param name="listWitId" select = "$listWitId" />
                        </xsl:call-template>
                    </xsl:when>
                    <xsl:when test="@part='I'">
                        <xsl:element name="p">
                            <xsl:attribute name="class">
                                <xsl:value-of select="concat('verso verso_1 inicial ', substring($listWitId,2,string-length($listWitId)))"/>
                            </xsl:attribute>
                            <xsl:apply-templates>
                                <xsl:with-param name="listWitId" select = "$listWitId" />
                            </xsl:apply-templates>
                        </xsl:element>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:element name="p">
                            <xsl:attribute name="class">
                                <xsl:value-of select="concat('verso verso_1 ', substring($listWitId,2,string-length($listWitId)))"/>
                            </xsl:attribute>
                            <xsl:apply-templates>
                                <xsl:with-param name="listWitId" select = "$listWitId" />
                            </xsl:apply-templates>
                        </xsl:element>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template name="versoSangrado">
        <xsl:param name = "listWitId" />
        <xsl:choose>
            <xsl:when test="@part='F'">
                <xsl:element name="p">
                    <xsl:attribute name="class">
                        <xsl:value-of select="concat('verso verso_1 versoSangrado final final_1 ', substring($listWitId,2,string-length($listWitId)))"/>
                    </xsl:attribute>
                    <xsl:apply-templates>
                        <xsl:with-param name="listWitId" select = "$listWitId" />
                    </xsl:apply-templates>
                </xsl:element>
            </xsl:when>
            <xsl:when test="@part='M'">
                <xsl:element name="p">
                    <xsl:attribute name="class">
                        <xsl:value-of select="concat('verso verso_1 versoSangrado medio medio_1 ', substring($listWitId,2,string-length($listWitId)))"/>
                    </xsl:attribute>
                    <xsl:apply-templates>
                        <xsl:with-param name="listWitId" select = "$listWitId" />
                    </xsl:apply-templates>
                </xsl:element>
            </xsl:when>
            <xsl:when test="@part='I'">
                <xsl:element name="p">
                    <xsl:attribute name="class">
                        <xsl:value-of select="concat('verso verso_1 versoSangrado inicial ', substring($listWitId,2,string-length($listWitId)))"/>
                    </xsl:attribute>
                    <xsl:apply-templates>
                        <xsl:with-param name="listWitId" select = "$listWitId" />
                    </xsl:apply-templates>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:element name="p">
                    <xsl:attribute name="class">
                        <xsl:value-of select="concat('verso verso_1 versoSangrado ', substring($listWitId,2,string-length($listWitId)))"/>
                    </xsl:attribute>
                    <xsl:apply-templates>
                        <xsl:with-param name="listWitId" select = "$listWitId" />
                    </xsl:apply-templates>
                </xsl:element>
            </xsl:otherwise>
        </xsl:choose>
   </xsl:template>
    
    <xsl:template name="versoMedio">
        <xsl:param name = "listWitId" />
        <xsl:element name="p">
            <xsl:attribute name="class">
                <xsl:value-of select="concat('verso verso_1 medio medio_1 ', substring($listWitId,2,string-length($listWitId)))"/>
            </xsl:attribute>
            <xsl:apply-templates>
                <xsl:with-param name="listWitId" select = "$listWitId" />
            </xsl:apply-templates>
        </xsl:element>
    </xsl:template>
    
    <xsl:template name="versoFinal">
        <xsl:param name = "listWitId" />
        <xsl:element name="p">
            <xsl:attribute name="class">
                <xsl:value-of select="concat('verso verso_1 final final_1 ', substring($listWitId,2,string-length($listWitId)))"/>
            </xsl:attribute>
            <xsl:apply-templates>
                <xsl:with-param name="listWitId" select = "$listWitId" />
            </xsl:apply-templates>
        </xsl:element>
    </xsl:template>
    
</xsl:stylesheet>