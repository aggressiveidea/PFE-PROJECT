"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Share2, Edit, Trash, User, Calendar, Globe } from "lucide-react";
import "./article-card.css";
import { getUserById } from "../../services/Api";

// Define the category colors and icons
const categoryMetadata = {
  "Contrats informatiques": {
    color: "#29ABE2",
    icon: "📄", // Document icon
  },
  "Criminalité informatique": {
    color: "#8E44AD",
    icon: "🔒", // Lock icon
  },
  "Données personnelles": {
    color: "#16A085",
    icon: "🔐", // Locked with key icon
  },
  Organisations: {
    color: "#E91E63",
    icon: "🏢", // Building icon
  },
  "Propriété intellectuelle": {
    color: "#F39C12",
    icon: "©️", // Copyright icon
  },
  Réseaux: {
    color: "#3498DB",
    icon: "🌐", // Globe icon
  },
  "Commerce électronique": {
    color: "#3498DB",
    icon: "🛒", // Shopping cart icon
  },
};

export default function EnhancedArticleCard( {
  article ,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,
} )
{

  // Get user from localStorage only once during component initialization
  const user = useMemo( () =>
  {
    try
    {
      return JSON.parse( localStorage.getItem( "user" ) || "{}" );
    } catch ( e )
    {
      console.error( "Error parsing user from localStorage:", e );
      return {};
    }
  }, [] );

  const [ isHovered, setIsHovered ] = useState( false );
  const [ animateCard, setAnimateCard ] = useState( false );
  const [ imageError, setImageError ] = useState( false );
  const [ ownerInfo, setOwnerInfo ] = useState( null );
  const [ ownerImageError, setOwnerImageError ] = useState( false );
  const [ showOwnerTooltip, setShowOwnerTooltip ] = useState( false );
  const [ hoveredButton, setHoveredButton ] = useState( null );
  const navigate = useNavigate();

  // Memoize article ID and owner ID to prevent unnecessary re-renders
  console.log("ownerrrrrrr", article.ownerId);
  const articleId = useMemo( () => article?._id, [ article?._id ] );
  const ownerId = useMemo( () => article?.ownerId, [ article?.ownerId ] );
  const userId = useMemo( () => user?._id, [ user?._id ] );

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      console.log( "owner",ownerId );
      try {
        const response = await getUserById(ownerId);
        //console.log("Response received:", response);

        //console.log("", `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim() );
        //console.log("", response.data.profileImgUrl);
         //console.log("", response.data.role);
        if (response) {
          setOwnerInfo({
            name:
              `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim()||
              "Unknown",
            profilePic: response.data.profileImgUrl || null,
            role: response.data.role || null,
          });
        } else {
          console.warn("Owner not found.");
        }
      } catch (error) {
        console.error("Error fetching owner info:", error);
      }
    };

    fetchOwnerInfo();
  }, [ownerId, ownerInfo]);


  // Format date if available
  const formattedDate = useMemo( () =>
  {
    if ( !article?.createdAt ) return "2023-04-15"; // Default date for demo
    try
    {
      return article.createdAt.slice( 0, 10 );
    } catch ( e )
    {
      return "Date not avaible"; // Default date for demo
    }
  }, [ article?.createdAt ] );

  // Extract year from date for hover effect
  const createdYear = useMemo( () =>
  {
    if ( !formattedDate ) return "2023";
    return formattedDate.split( "-" )[ 0 ];
  }, [ formattedDate ] );

  // Determine owner info only once when component mounts or when relevant props change
  useEffect( () =>
  {
    // Start animation
    setAnimateCard( true );

    // Only set owner info if we don't already have it and if ownerId exists
   
  }, [
    ownerId,
    userId,
    article.ownerName,
    article.ownerPic,
    article.ownerRole,
    ownerInfo,
    user.name,
    user.username,
    user.profilePic,
    user.role,
  ] );

  //console.log( "owner ", ownerInfo );

  const handleCardClick = useCallback(
    ( e ) =>
    {
      if (
        e.target.closest( ".action-button" ) ||
        e.target.closest( ".favorite-button" ) ||
        e.target.closest( ".share-button" ) ||
        e.target.closest( ".edit-button" ) ||
        e.target.closest( ".delete-button" ) ||
        e.target.closest( ".owner-profile-link" )
      )
      {
        return;
      }
      if ( articleId )
      {
        window.location.href = `/articles/${articleId}`;
      }
    },
    [ articleId ]
  );

const handleOwnerClick = useCallback(
  (e) => {
    e.stopPropagation();

    setShowOwnerTooltip(true);

    // Hide tooltip after 3 seconds
    setTimeout(() => {
      setShowOwnerTooltip(false);
    }, 3000);

    if ( ownerId )
    {
      
      navigate(`/userProfile?id=${ownerId}`);
    }

    console.log(`View profile of user: ${ownerId}`);
  },
  [ownerId, navigate]
);

  const handleEdit = useCallback(
    ( e ) =>
    {
      e.stopPropagation();
      if ( onEdit && articleId )
      {
        onEdit( articleId );
      }
    },
    [ onEdit, articleId ]
  );

  const handleDelete = useCallback(
    ( e ) =>
    {
      e.stopPropagation();
      if ( onDelete && articleId )
      {
        onDelete( articleId );
      }
    },
    [ onDelete, articleId ]
  );

  const handleShare = useCallback(
    ( e ) =>
    {
      e.stopPropagation();
      // Share functionality
      if ( navigator.share && article )
      {
        navigator
          .share( {
            title: article.title || "Article",
            text:
              article.description ||
              article.content ||
              "Check out this article",
            url: `/articles/${articleId}`,
          } )
          .catch( ( err ) => console.log( "Error sharing", err ) );
      }
    },
    [ article, articleId ]
  );

  const handleToggleFav = useCallback(
    ( e ) =>
    {
      e.stopPropagation();
      if ( articleId && onToggleFavorite )
      {
        onToggleFavorite( articleId );
      }
    },
    [ articleId, onToggleFavorite ]
  );

  const handleImageError = useCallback( () =>
  {
    console.log( "Image failed to load" );
    setImageError( true );
  }, [] );

  const handleOwnerImageError = useCallback( () =>
  {
    setOwnerImageError( true );
  }, [] );

  // Memoize permission checks
  const role = user?.role;
  const canEdit = useMemo(
    () =>
      role === "Content-admin" || ( role === "Ict-expert" && userId === ownerId ),
    [ role, userId, ownerId ]
  );
  const canDelete = canEdit;

  // Get category metadata
  const getCategoryColor = useCallback( ( category ) =>
  {
    return categoryMetadata[ category ]?.color || "#6c757d";
  }, [] );

  const getCategoryIcon = useCallback( ( category ) =>
  {
    return categoryMetadata[ category ]?.icon || "📋";
  }, [] );

 useEffect(() => {
   if (ownerInfo?.profilePic) {
     console.log("ProfilePic type:", typeof ownerInfo.profilePic);
     console.log("ProfilePic value:", ownerInfo.profilePic.slice(0, 100));
   }
 }, [ownerInfo]);

  return (
    <div
      className={`library-card  }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="card-header">
        {article?.category && (
          <div
            className="card-category"
            style={{
              backgroundColor: `${getCategoryColor(article.category)}20`,
              color: getCategoryColor(article.category),
            }}
          >
            <div className="category-content">
              <span className="category-icon-article">
                {getCategoryIcon(article.category)}
              </span>
              <span>{article.category}</span>
            </div>
          </div>
        )}
        <div className="header-actions">
          <button
            onClick={handleShare}
            className="action-button share-button-article"
            aria-label="Share article"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={handleToggleFav}
            className={`favorite-button-article ${isFavorite ? "active" : ""}`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Show base64 image below title with error handling */}
      {article?.imageUrl && !imageError && (
        <div className="article-image-wrapper">
          <img
            src={article.imageUrl}
            alt={article.title || "Article image"}
            className="article-image"
            onError={handleImageError}
          />
        </div>
      )}

      

      {/* Owner information - now with tooltip instead of navigation */}
      <div className="owner-profile-link" onClick={handleOwnerClick}>
        <div className="owner-info">
          <div className="owner-avatar">
            {ownerInfo?.profilePic && !ownerImageError ? (
              <img
                src={ownerInfo.profilePic}
                alt="Owner"
                onError={handleOwnerImageError}
              />
            ) : (
              <div className="avatar-placeholder">
                <User size={16} />
              </div>
            )}
          </div>
          <div className="owner-details">
            <span className="owner-name">
              {ownerInfo?.name || article?.ownerName || "Unknown author"}
            </span>
            {(ownerInfo?.role || article?.role) && (
              <span className="owner-role">
                {ownerInfo?.role || article?.role}
              </span>
            )}
          </div>
        </div>

        {/* Owner profile tooltip */}
        {showOwnerTooltip && (
          <div className="owner-tooltip">Profile feature coming soon!</div>
        )}
      </div>
      <h3 className="card-title-article">
              {article?.title || "Untitled Article"}
            </h3>
      {/* Metadata section with language and date */}
      <div className="article-metadata">
        {article?.language && (
          <div className="metadata-item language-item">
            <Globe size={14} color="#3498db" />
            <span>{article.language || "English"}</span>
          </div>
        )}
        <div className="metadata-item date-item">
          <Calendar size={14} color="#f100ed77" />
          <span>Created: {formattedDate}</span>
        </div>
      </div>
{/* Show truncated description with ellipsis */}
      <p className="card-definition">
        {article?.content?.length > 100
          ? `${article.content.substring(0, 100)}...`
          : article?.content || "No description available"}
      </p>
      <div className="card-footer">
        <div className="admin-actions">
          {/* Delete button first, then edit button */}
          {(canEdit || canDelete) && (
            <div className="article-actions">
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className={`delete-button-article ${
                    hoveredButton === "delete" ? "hovered" : ""
                  }`}
                  onMouseEnter={() => setHoveredButton("delete")}
                  onMouseLeave={() => setHoveredButton(null)}
                  aria-label="Delete article"
                >
                  <Trash size={hoveredButton === "delete" ? 20 : 18} />
                  {hoveredButton === "delete" && (
                    <span className="button-label">Delete</span>
                  )}
                </button>
              )}
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className={`edit-button-article ${
                    hoveredButton === "edit" ? "hovered" : ""
                  }`}
                  onMouseEnter={() => setHoveredButton("edit")}
                  onMouseLeave={() => setHoveredButton(null)}
                  aria-label="Edit article"
                >
                  <Edit size={hoveredButton === "edit" ? 20 : 18} />
                  {hoveredButton === "edit" && (
                    <span className="button-label">Edit</span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}