import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';

export interface FeedPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
    verified: boolean;
  };
  content: {
    text: string;
    images?: string[];
    video?: string;
  };
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isShared: boolean;
  showComments: boolean;
  commentsList: Comment[];
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  text: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

export interface TrendingTopic {
  tag: string;
  posts: number;
  trend: 'up' | 'down';
}

export interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  followers: number;
  isFollowing: boolean;
}

export interface Activity {
  id: string;
  type: 'like' | 'comment' | 'share' | 'follow' | 'post';
  text: string;
  timestamp: Date;
}

export interface FeedStats {
  posts: number;
  likes: number;
  comments: number;
  shares: number;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, FeatherIconComponent],
  template: `
    <div class="feed-container">
      <!-- Feed Header -->
      <div class="feed-header">
        <h1>Feed</h1>
        <div class="feed-actions">
          <button class="btn-primary" (click)="createPost()">
            <app-feather-icon name="plus" size="16px"></app-feather-icon>
            Create Post
          </button>
        </div>
      </div>

      <!-- Create Post Section -->
      <div class="create-post" *ngIf="showCreatePost">
        <div class="create-post-header">
          <h3>Create New Post</h3>
          <button class="btn-close" (click)="closeCreatePost()">
            <app-feather-icon name="x" size="20px"></app-feather-icon>
          </button>
        </div>
        <div class="create-post-content">
          <textarea 
            [(ngModel)]="newPostText" 
            placeholder="What's happening?"
            class="post-textarea"
            rows="4">
          </textarea>
          <div class="create-post-actions">
            <div class="post-options">
              <button class="option-btn" (click)="addImage()">
                <app-feather-icon name="image" size="16px"></app-feather-icon>
                Photo
              </button>
              <button class="option-btn" (click)="addVideo()">
                <app-feather-icon name="video" size="16px"></app-feather-icon>
                Video
              </button>
            </div>
            <button class="btn-primary" (click)="publishPost()" [disabled]="!newPostText.trim()">
              Post
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Layout -->
      <div class="feed-layout">
        <!-- Main Feed Column -->
        <div class="feed-main">
          <!-- Feed Posts -->
          <div class="feed-posts">
        <div class="post-card" *ngFor="let post of posts; trackBy: trackByPostId">
          <!-- Post Header -->
          <div class="post-header">
            <div class="user-info">
              <img [src]="post.user.avatar" [alt]="post.user.name" class="user-avatar">
              <div class="user-details">
                <div class="user-name">
                  {{ post.user.name }}
                  <app-feather-icon *ngIf="post.user.verified" name="check-circle" size="16px" class="verified-icon"></app-feather-icon>
                </div>
                <div class="user-username">@{{ post.user.username }}</div>
                <div class="post-time">{{ formatTime(post.timestamp) }}</div>
              </div>
            </div>
            <button class="post-menu">
              <app-feather-icon name="more-horizontal" size="20px"></app-feather-icon>
            </button>
          </div>

          <!-- Post Content -->
          <div class="post-content">
            <p class="post-text">{{ post.content.text }}</p>
            
            <!-- Post Images -->
            <div class="post-images" *ngIf="post.content.images && post.content.images.length > 0">
              <div class="image-grid" [ngClass]="'grid-' + post.content.images.length">
                <img 
                  *ngFor="let image of post.content.images; let i = index" 
                  [src]="image" 
                  [alt]="'Post image ' + (i + 1)"
                  class="post-image"
                  (click)="openImageModal(image, post.content.images, i)">
              </div>
            </div>

            <!-- Post Video -->
            <div class="post-video" *ngIf="post.content.video">
              <video controls class="video-player">
                <source [src]="post.content.video" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <!-- Post Actions -->
          <div class="post-actions">
            <button 
              class="action-btn" 
              [class.liked]="post.isLiked"
              (click)="toggleLike(post)">
              <app-feather-icon 
                name="heart" 
                size="18px">
              </app-feather-icon>
              <span>{{ post.likes }}</span>
            </button>

            <button class="action-btn" (click)="toggleComments(post)">
              <app-feather-icon name="message-circle" size="18px"></app-feather-icon>
              <span>{{ post.comments }}</span>
            </button>

            <button 
              class="action-btn" 
              [class.shared]="post.isShared"
              (click)="toggleShare(post)">
              <app-feather-icon name="share-2" size="18px"></app-feather-icon>
              <span>{{ post.shares }}</span>
            </button>

            <button class="action-btn">
              <app-feather-icon name="bookmark" size="18px"></app-feather-icon>
            </button>
          </div>

          <!-- Comments Section -->
          <div class="comments-section" *ngIf="post.showComments">
            <!-- Add Comment -->
            <div class="add-comment">
              <img src="assets/img/user.png" alt="Your avatar" class="comment-avatar">
              <div class="comment-input-wrapper">
                <input 
                  [(ngModel)]="newCommentText" 
                  placeholder="Write a comment..."
                  class="comment-input"
                  (keyup.enter)="addComment(post)">
                <button class="comment-btn" (click)="addComment(post)" [disabled]="!newCommentText.trim()">
                  <app-feather-icon name="send" size="16px"></app-feather-icon>
                </button>
              </div>
            </div>

            <!-- Comments List -->
            <div class="comments-list">
              <div class="comment" *ngFor="let comment of post.commentsList">
                <img [src]="comment.user.avatar" [alt]="comment.user.name" class="comment-avatar">
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-user">{{ comment.user.name }}</span>
                    <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
                  </div>
                  <p class="comment-text">{{ comment.text }}</p>
                  <div class="comment-actions">
                    <button class="comment-action" (click)="toggleCommentLike(comment)">
                      <app-feather-icon 
                        name="heart" 
                        size="14px">
                      </app-feather-icon>
                      <span>{{ comment.likes }}</span>
                    </button>
                    <button class="comment-action">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Sidebar Widgets -->
        <div class="feed-sidebar">
          <!-- Trending Topics Widget -->
          <div class="widget trending-widget">
            <div class="widget-header">
              <h3>Trending Topics</h3>
              <app-feather-icon name="trending-up" size="16px"></app-feather-icon>
            </div>
            <div class="trending-list">
              <div class="trending-item" *ngFor="let trend of trendingTopics">
                <div class="trending-content">
                  <span class="trending-tag">#{{ trend.tag }}</span>
                  <span class="trending-posts">{{ trend.posts }} posts</span>
                </div>
                <div class="trending-trend" [class.up]="trend.trend === 'up'" [class.down]="trend.trend === 'down'">
                  <app-feather-icon [name]="trend.trend === 'up' ? 'trending-up' : 'trending-down'" size="12px"></app-feather-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Suggested Users Widget -->
          <div class="widget suggested-widget">
            <div class="widget-header">
              <h3>Suggested for You</h3>
              <app-feather-icon name="users" size="16px"></app-feather-icon>
            </div>
            <div class="suggested-list">
              <div class="suggested-user" *ngFor="let user of suggestedUsers">
                <img [src]="user.avatar" [alt]="user.name" class="user-avatar">
                <div class="user-info">
                  <div class="user-name">
                    {{ user.name }}
                    <app-feather-icon *ngIf="user.verified" name="check-circle" size="14px" class="verified-icon"></app-feather-icon>
                  </div>
                  <div class="user-username">@{{ user.username }}</div>
                  <div class="user-followers">{{ user.followers }} followers</div>
                </div>
                <button class="follow-btn" [class.following]="user.isFollowing" (click)="toggleFollow(user)">
                  {{ user.isFollowing ? 'Following' : 'Follow' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Activity Widget -->
          <div class="widget activity-widget">
            <div class="widget-header">
              <h3>Recent Activity</h3>
              <app-feather-icon name="activity" size="16px"></app-feather-icon>
            </div>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of recentActivity">
                <div class="activity-icon" [class]="activity.type">
                  <app-feather-icon [name]="getActivityIcon(activity.type)" size="16px"></app-feather-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{ activity.text }}</div>
                  <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feed Stats Widget -->
          <div class="widget stats-widget">
            <div class="widget-header">
              <h3>Your Feed Stats</h3>
              <app-feather-icon name="bar-chart-2" size="16px"></app-feather-icon>
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ feedStats.posts }}</div>
                <div class="stat-label">Posts</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ feedStats.likes }}</div>
                <div class="stat-label">Likes</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ feedStats.comments }}</div>
                <div class="stat-label">Comments</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ feedStats.shares }}</div>
                <div class="stat-label">Shares</div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Widget -->
          <div class="widget quick-actions-widget">
            <div class="widget-header">
              <h3>Quick Actions</h3>
              <app-feather-icon name="zap" size="16px"></app-feather-icon>
            </div>
            <div class="quick-actions-grid">
              <button class="quick-action-btn" (click)="quickAction('photo')">
                <app-feather-icon name="camera" size="18px"></app-feather-icon>
                <span>Photo</span>
              </button>
              <button class="quick-action-btn" (click)="quickAction('video')">
                <app-feather-icon name="video" size="18px"></app-feather-icon>
                <span>Video</span>
              </button>
              <button class="quick-action-btn" (click)="quickAction('poll')">
                <app-feather-icon name="bar-chart" size="18px"></app-feather-icon>
                <span>Poll</span>
              </button>
              <button class="quick-action-btn" (click)="quickAction('event')">
                <app-feather-icon name="calendar" size="18px"></app-feather-icon>
                <span>Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  posts: FeedPost[] = [];
  showCreatePost = false;
  newPostText = '';
  newCommentText = '';
  trendingTopics: TrendingTopic[] = [];
  suggestedUsers: SuggestedUser[] = [];
  recentActivity: Activity[] = [];
  feedStats: FeedStats = { posts: 0, likes: 0, comments: 0, shares: 0 };

  ngOnInit() {
    this.loadFeedPosts();
    this.loadTrendingTopics();
    this.loadSuggestedUsers();
    this.loadRecentActivity();
    this.loadFeedStats();
  }

  loadFeedPosts() {
    // Mock data - replace with actual API call
    this.posts = [
      {
        id: '1',
        user: {
          name: 'John Doe',
          avatar: 'assets/img/user.png',
          username: 'johndoe',
          verified: true
        },
        content: {
          text: 'Just finished a great milk collection session! The quality this season has been exceptional. 🥛✨',
          images: ['assets/img/splash.jpg', 'assets/img/splash_cover.jpg']
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 24,
        comments: 8,
        shares: 3,
        isLiked: false,
        isShared: false,
        showComments: false,
        commentsList: [
          {
            id: 'c1',
            user: {
              name: 'Jane Smith',
              avatar: 'assets/img/user.png',
              username: 'janesmith'
            },
            text: 'Amazing work! The quality really shows.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            likes: 5,
            isLiked: false,
            replies: []
          }
        ]
      },
      {
        id: '2',
        user: {
          name: 'Farm Manager',
          avatar: 'assets/img/user.png',
          username: 'farmmanager',
          verified: true
        },
        content: {
          text: 'Weekly farm update: We\'ve increased our milk production by 15% this month! Thanks to all our dedicated farmers. 🚜🌾',
          images: ['assets/img/splash.jpg']
        },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        likes: 42,
        comments: 12,
        shares: 7,
        isLiked: true,
        isShared: false,
        showComments: false,
        commentsList: []
      }
    ];
  }

  createPost() {
    this.showCreatePost = true;
  }

  closeCreatePost() {
    this.showCreatePost = false;
    this.newPostText = '';
  }

  publishPost() {
    if (!this.newPostText.trim()) return;

    const newPost: FeedPost = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'assets/img/user.png',
        username: 'you',
        verified: false
      },
      content: {
        text: this.newPostText
      },
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isShared: false,
      showComments: false,
      commentsList: []
    };

    this.posts.unshift(newPost);
    this.closeCreatePost();
  }

  toggleLike(post: FeedPost) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
  }

  toggleComments(post: FeedPost) {
    post.showComments = !post.showComments;
  }

  toggleShare(post: FeedPost) {
    post.isShared = !post.isShared;
    post.shares += post.isShared ? 1 : -1;
  }

  addComment(post: FeedPost) {
    if (!this.newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'assets/img/user.png',
        username: 'you'
      },
      text: this.newCommentText,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    post.commentsList.push(newComment);
    post.comments++;
    this.newCommentText = '';
  }

  toggleCommentLike(comment: Comment) {
    comment.isLiked = !comment.isLiked;
    comment.likes += comment.isLiked ? 1 : -1;
  }

  addImage() {
    // TODO: Implement image upload
    console.log('Add image');
  }

  addVideo() {
    // TODO: Implement video upload
    console.log('Add video');
  }

  openImageModal(image: string, images: string[], index: number) {
    // TODO: Implement image modal
    console.log('Open image modal', image, index);
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }

  trackByPostId(index: number, post: FeedPost): string {
    return post.id;
  }

  loadTrendingTopics() {
    this.trendingTopics = [
      { tag: 'MilkCollection', posts: 1247, trend: 'up' },
      { tag: 'FarmLife', posts: 892, trend: 'up' },
      { tag: 'DairyFarming', posts: 654, trend: 'down' },
      { tag: 'OrganicMilk', posts: 423, trend: 'up' },
      { tag: 'FarmTech', posts: 312, trend: 'up' },
      { tag: 'SustainableFarming', posts: 289, trend: 'down' }
    ];
  }

  loadSuggestedUsers() {
    this.suggestedUsers = [
      {
        id: '1',
        name: 'Sarah Johnson',
        username: 'sarahj_farm',
        avatar: 'assets/img/user.png',
        verified: true,
        followers: 2450,
        isFollowing: false
      },
      {
        id: '2',
        name: 'Mike Chen',
        username: 'mike_dairy',
        avatar: 'assets/img/user.png',
        verified: false,
        followers: 1200,
        isFollowing: false
      },
      {
        id: '3',
        name: 'Emma Wilson',
        username: 'emma_organic',
        avatar: 'assets/img/user.png',
        verified: true,
        followers: 3200,
        isFollowing: true
      },
      {
        id: '4',
        name: 'David Brown',
        username: 'david_farmer',
        avatar: 'assets/img/user.png',
        verified: false,
        followers: 890,
        isFollowing: false
      }
    ];
  }

  loadRecentActivity() {
    this.recentActivity = [
      {
        id: '1',
        type: 'like',
        text: 'Someone liked your post about milk collection',
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        id: '2',
        type: 'comment',
        text: 'New comment on your farm update',
        timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      },
      {
        id: '3',
        type: 'follow',
        text: 'Sarah Johnson started following you',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: '4',
        type: 'share',
        text: 'Your post was shared 3 times',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        id: '5',
        type: 'post',
        text: 'You published a new post',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ];
  }

  loadFeedStats() {
    this.feedStats = {
      posts: 12,
      likes: 156,
      comments: 34,
      shares: 8
    };
  }

  toggleFollow(user: SuggestedUser) {
    user.isFollowing = !user.isFollowing;
    user.followers += user.isFollowing ? 1 : -1;
  }

  getActivityIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'like': 'heart',
      'comment': 'message-circle',
      'share': 'share-2',
      'follow': 'user-plus',
      'post': 'edit-3'
    };
    return iconMap[type] || 'activity';
  }

  quickAction(action: string) {
    console.log('Quick action triggered:', action);
    // TODO: Implement quick actions
    switch(action) {
      case 'photo':
        this.addImage();
        break;
      case 'video':
        this.addVideo();
        break;
      case 'poll':
        console.log('Create poll');
        break;
      case 'event':
        console.log('Create event');
        break;
    }
  }
}
