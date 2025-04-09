"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Skeleton,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowForward, Bookmark, BookmarkBorder } from "@mui/icons-material";
import { motion } from "framer-motion";
import { ITopicItem } from "../types/topic";
import IconButton from "./IconButton";

export const mockTopics: ITopicItem[] = [
  {
    id: 1,
    name: "Daily Conversations",
    description: "Learn common phrases and vocabulary for everyday situations",
    thumbnail:
      "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/11/top-meme-meo-cuc-dang-yeu-74.png.webp",
    sessionCount: 8,
    level: "Beginner",
  },
  {
    id: 2,
    name: "Business English",
    description: "Professional vocabulary and expressions for the workplace",
    thumbnail:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/anh-meo-13.png",
    sessionCount: 6,
    level: "Intermediate",
  },
  {
    id: 3,
    name: "Travel & Tourism",
    description:
      "Essential phrases for traveling abroad and tourist situations",
    thumbnail: "https://dongvat.edu.vn/upload/2025/01/meo-cute-meme-50.webp",
    sessionCount: 5,
    level: "Beginner",
  },
  {
    id: 4,
    name: "Academic Discussions",
    description: "Vocabulary and expressions for academic contexts and debates",
    thumbnail:
      "https://app.gak.vn/storage/uploads/p2UlVPyiP3GjRIZEJi11mqrhOtoNkHNxrx04ztSM.jpg",
    sessionCount: 7,
    level: "Advanced",
  },
  {
    id: 5,
    name: "Social Media & Technology",
    description: "Modern terms related to technology and online communication",
    thumbnail: "https://devo.vn/wp-content/uploads/2023/01/meo-cam-dao.jpg",
    sessionCount: 4,
    level: "Intermediate",
  },
  {
    id: 6,
    name: "Health & Wellness",
    description:
      "Vocabulary related to health, fitness, and medical situations",
    thumbnail:
      "https://anhnail.com/wp-content/uploads/2024/11/meo-con-anh-meo-cute.jpg",
    sessionCount: 6,
    level: "Intermediate",
  },
];

export type Props = {
  title?: string;
  showDivider?: boolean;
};

export default function TopicList({
  title = "Topics",
  showDivider = true,
}: Props) {
  const [topics, setTopics] = useState<ITopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    const fetchTopics = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTopics(mockTopics);
      setLoading(false);
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topicId: number) => {
    navigate(`/topic/${topicId}`);
  };

  const toggleFavorite = (e: React.MouseEvent, topicId: number) => {
    e.stopPropagation();
    setTopics(
      topics.map((topic) =>
        topic.id === topicId
          ? { ...topic, isFavorite: !topic.isFavorite }
          : topic
      )
    );
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

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {title}
      </Typography>
      {showDivider && <Divider sx={{ mb: 4 }} />}

      <motion.div variants={container} initial="hidden" animate="show">
        <Grid container spacing={3}>
          {loading
            ? // Loading skeletons
              Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: "100%" }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={40} />
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton variant="text" height={80} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : // Actual content
              topics.map((topic) => (
                <Grid item xs={12} sm={6} md={4} key={topic.id}>
                  <motion.div variants={item}>
                    <Card
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "visible",
                      }}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={topic.thumbnail}
                          alt={topic.name}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            zIndex: 1,
                          }}
                        >
                          <IconButton
                            onClick={(e: any) => toggleFavorite(e, topic.id)}
                            sx={{
                              bgcolor: "white",
                              "&:hover": { bgcolor: "white" },
                            }}
                          >
                            {topic.isFavorite ? (
                              <Bookmark color="primary" />
                            ) : (
                              <BookmarkBorder color="primary" />
                            )}
                          </IconButton>
                        </Box>
                        <Chip
                          label={topic.level}
                          size="small"
                          color={
                            topic.level === "Beginner"
                              ? "success"
                              : topic.level === "Intermediate"
                              ? "primary"
                              : "secondary"
                          }
                          sx={{
                            position: "absolute",
                            bottom: -10,
                            left: 16,
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                      <CardContent sx={{ pt: 3 }}>
                        <Typography
                          variant="h5"
                          component="h3"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {topic.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {topic.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {topic.sessionCount} sessions
                          </Typography>
                          <Button
                            size="small"
                            endIcon={<ArrowForward />}
                            sx={{ fontWeight: 600 }}
                          >
                            Explore
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
        </Grid>
      </motion.div>
    </Box>
  );
}
