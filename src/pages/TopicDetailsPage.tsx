"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Breadcrumbs,
  Link,
  Skeleton,
  Divider,
  Chip,
  Avatar,
  useTheme,
  alpha,
  CardActionArea,
  CardMedia,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  LocalOffer,
  QuestionAnswer,
  Tag as TagIcon,
  PlayArrow,
  Info,
  MenuBook,
  School,
  Headphones,
  VolumeUp,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import type { ITopicItem } from "../types/topic";
import type { ITagItem } from "../types/tag";
import { getDetailsTopic } from "../api/topic";
import { getAllTags } from "../api/tag";

export default function TopicDetailsPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [tags, setTags] = useState<ITagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);

  const fetchTopicAndTags = async (topicId: number) => {
    setLoading(true);
    try {
      // Fetch topic details
      const topicRes = await getDetailsTopic(topicId);
      const topicData = topicRes?.data?.data;
      setTopic(topicData);

      if (topicData?.type) {
        // Fetch tags with the same type as the topic
        const tagsRes = await getAllTags({ type: topicData.type });
        setTags(tagsRes?.items || []);
      }
    } catch (error) {
      console.error("Error fetching topic and tags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) fetchTopicAndTags(Number(topicId));

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favoriteTags");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [topicId]);

  const handleTagClick = (tagId: number) => {
    // Navigate to questions page filtered by tag
    navigate(`/topic/${topicId}/tag/${tagId}/questions`);
  };

  const toggleFavorite = (tagId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    const newFavorites = favorites.includes(tagId)
      ? favorites.filter((id) => id !== tagId)
      : [...favorites, tagId];

    setFavorites(newFavorites);
    localStorage.setItem("favoriteTags", JSON.stringify(newFavorites));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const getTagIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "part1":
        return <School />;
      case "part2":
        return <VolumeUp />;
      case "part3":
        return <Headphones />;
      case "part4":
        return <MenuBook />;
      default:
        return <LocalOffer />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ my: 3, borderRadius: 2 }}
        />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={100} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" height={40} width={150} />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={160}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!topic) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Topic not found</Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => navigate("/topics")}
            style={{ cursor: "pointer" }}
          >
            <MenuBook sx={{ mr: 0.5 }} fontSize="inherit" />
            Topics
          </Link>
          <Typography color="text.primary">{topic.name}</Typography>
        </Breadcrumbs>

        {/* Topic Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            elevation={2}
            sx={{
              mb: 5,
              borderRadius: 3,
              overflow: "hidden",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05
              )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    topic.thumbnailUrl ||
                    "/placeholder.svg?height=200&width=1200"
                  }
                  alt={topic.name}
                  sx={{
                    objectFit: "cover",
                    filter: "brightness(0.85)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    p: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Button
                      startIcon={<ArrowBack />}
                      onClick={() => window.history.back()}
                      sx={{
                        mr: 2,
                        color: "white",
                        borderColor: "rgba(255,255,255,0.5)",
                      }}
                      variant="outlined"
                      size="small"
                    >
                      Back
                    </Button>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{ fontWeight: 700 }}
                    >
                      {topic.name}
                    </Typography>
                    {topic.type && (
                      <Chip
                        label={topic.type}
                        size="small"
                        color="primary"
                        icon={<TagIcon fontSize="small" />}
                        sx={{ ml: 2, fontWeight: 500 }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography variant="body1" paragraph>
                  {topic.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Chip
                    icon={<Info />}
                    label={`Type: ${topic.type}`}
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    icon={<QuestionAnswer />}
                    label={`${tags.length} Tags Available`}
                    variant="outlined"
                    color="info"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            mt: 6,
            display: "flex",
            alignItems: "center",
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              borderRadius: 2,
              bgcolor: theme.palette.primary.main,
            },
          }}
        >
          <LocalOffer sx={{ mr: 1 }} />
          Available Tags ({tags.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click on a tag to view all questions in that category
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {tags.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No tags available for this topic type
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tags with type "{topic.type}" will appear here
            </Typography>
          </Box>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show">
            <Grid container spacing={3}>
              {tags.map((tag) => (
                <Grid item xs={12} sm={6} md={4} key={tag.id}>
                  <motion.div
                    variants={item}
                    onHoverStart={() => setHoveredTag(tag.id)}
                    onHoverEnd={() => setHoveredTag(null)}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        transition: "all 0.3s ease",
                        transform:
                          hoveredTag === tag.id ? "translateY(-8px)" : "none",
                        boxShadow:
                          hoveredTag === tag.id
                            ? "0 12px 28px rgba(0, 0, 0, 0.15)"
                            : "0 8px 16px rgba(0, 0, 0, 0.08)",
                        borderRadius: 3,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {favorites.includes(tag.id) && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bgcolor: "warning.main",
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderBottomLeftRadius: 8,
                            zIndex: 1,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Bookmark fontSize="small" />
                          Favorite
                        </Box>
                      )}

                      <CardActionArea
                        onClick={() => handleTagClick(tag.id)}
                        sx={{ height: "100%" }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  color: theme.palette.primary.main,
                                  width: 48,
                                  height: 48,
                                  mr: 2,
                                }}
                              >
                                {getTagIcon(tag.type)}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {tag.name}
                                </Typography>
                                <Chip
                                  label={tag.type}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            </Box>

                            <Tooltip
                              title={
                                favorites.includes(tag.id)
                                  ? "Remove from favorites"
                                  : "Add to favorites"
                              }
                            >
                              <IconButton
                                onClick={(e) => toggleFavorite(tag.id, e)}
                                color={
                                  favorites.includes(tag.id)
                                    ? "warning"
                                    : "default"
                                }
                                sx={{
                                  opacity:
                                    hoveredTag === tag.id ||
                                    favorites.includes(tag.id)
                                      ? 1
                                      : 0.3,
                                  transition: "opacity 0.3s ease",
                                }}
                              >
                                {favorites.includes(tag.id) ? (
                                  <Bookmark />
                                ) : (
                                  <BookmarkBorder />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            Practice questions related to {tag.name} in the{" "}
                            {topic.name} topic.
                          </Typography>

                          <AnimatePresence>
                            {hoveredTag === tag.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 2,
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<PlayArrow />}
                                    sx={{
                                      borderRadius: 6,
                                      px: 2,
                                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                      boxShadow: `0 3px 5px 2px ${alpha(
                                        theme.palette.primary.main,
                                        0.3
                                      )}`,
                                    }}
                                  >
                                    Start Practice
                                  </Button>
                                </Box>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + Math.min(tags.length, 6) * 0.1 }}
        >
          <Box
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.info.main,
                0.05
              )} 0%, ${alpha(theme.palette.info.main, 0.15)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Ready to improve your English skills?
            </Typography>
            <Typography variant="body1" paragraph>
              Choose a tag above to start practicing with interactive exercises.
            </Typography>
            <Button
              variant="contained"
              color="info"
              size="large"
              onClick={() => navigate("/topics")}
              startIcon={<MenuBook />}
              sx={{
                mt: 1,
                borderRadius: 6,
                px: 3,
                py: 1,
                background: `linear-gradient(45deg, ${theme.palette.info.main} 30%, ${theme.palette.info.light} 90%)`,
                boxShadow: `0 3px 5px 2px ${alpha(
                  theme.palette.info.main,
                  0.3
                )}`,
              }}
            >
              Explore More Topics
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
}
