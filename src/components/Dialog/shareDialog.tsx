import React, { useState } from 'react';
import { 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  TextField, 
  Button,
  Tooltip 
} from '@mui/material';
import { toast } from 'react-toastify';

interface ShareDialogProps {
  videoUrl: string;
  videoTitle: string;
  videoThumbnail: string;
  onClose: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ 
  videoUrl, 
  videoTitle, 
  onClose 
}) => {
  const [copied, setCopied] = useState(false);

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Share on social media platforms
  const handleShareOnPlatform = (platform: string) => {
    const encodedUrl = encodeURIComponent(videoUrl);
    const encodedTitle = encodeURIComponent(videoTitle);
    
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Native share API (for mobile devices)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: videoTitle,
          url: videoUrl,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      toast.info('Native sharing not supported on this device');
    }
  };

  return (
    <div className="p-6 w-full md:w-[500px]">
      <DialogTitle className="flex justify-between items-center p-0 mb-4">
        <h2 className="text-xl font-bold">Share</h2>
        <IconButton onClick={onClose} size="small">
          <i className="fa-solid fa-xmark" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-0">
        {/* Copy Link Section */}
        <div className="mb-6">
          <div className="flex gap-2">
            <TextField
              value={videoUrl}
              fullWidth
              size="small"
              InputProps={{
                readOnly: true,
              }}
              className="bg-gray-100"
            />
            <Button 
              variant="contained" 
              onClick={handleCopyLink}
              className="whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Social Media Share Buttons */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">Share on social media</h3>
          <div className="grid grid-cols-4 gap-4">
            <Tooltip title="Facebook">
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={() => handleShareOnPlatform('facebook')}
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <i className="fa-brands fa-facebook-f text-xl" />
                </div>
                <span className="text-xs mt-1">Facebook</span>
              </div>
            </Tooltip>

            <Tooltip title="Twitter">
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={() => handleShareOnPlatform('twitter')}
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white">
                  <i className="fa-brands fa-x-twitter text-xl" />
                </div>
                <span className="text-xs mt-1">Twitter</span>
              </div>
            </Tooltip>

            <Tooltip title="WhatsApp">
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={() => handleShareOnPlatform('whatsapp')}
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <i className="fa-brands fa-whatsapp text-xl" />
                </div>
                <span className="text-xs mt-1">WhatsApp</span>
              </div>
            </Tooltip>

            <Tooltip title="LinkedIn">
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={() => handleShareOnPlatform('linkedin')}
              >
                <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white">
                  <i className="fa-brands fa-linkedin-in text-xl" />
                </div>
                <span className="text-xs mt-1">LinkedIn</span>
              </div>
            </Tooltip>

            <Tooltip title="Telegram">
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={() => handleShareOnPlatform('telegram')}
              >
                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white">
                  <i className="fa-brands fa-telegram text-xl" />
                </div>
                <span className="text-xs mt-1">Telegram</span>
              </div>
            </Tooltip>

            <Tooltip title="Reddit">
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={() => handleShareOnPlatform('reddit')}
              >
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white">
                  <i className="fa-brands fa-reddit-alien text-xl" />
                </div>
                <span className="text-xs mt-1">Reddit</span>
              </div>
            </Tooltip>

            <Tooltip title="Email">
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={() => handleShareOnPlatform('email')}
              >
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  <i className="fa-solid fa-envelope text-xl" />
                </div>
                <span className="text-xs mt-1">Email</span>
              </div>
            </Tooltip>

            <Tooltip title="More">
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={handleNativeShare}
              >
                <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white">
                  <i className="fa-solid fa-share-nodes text-xl" />
                </div>
                <span className="text-xs mt-1">More</span>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Embed Code Section */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Embed</h3>
          <div className="flex gap-2">
            <TextField
              value={`<iframe src="${videoUrl}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`}
              fullWidth
              size="small"
              multiline
              rows={2}
              InputProps={{
                readOnly: true,
              }}
              className="bg-gray-100"
            />
            <Button 
              variant="outlined" 
              onClick={() => {
                navigator.clipboard.writeText(
                  `<iframe src="${videoUrl}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`
                );
                toast.success('Embed code copied!');
              }}
              className="whitespace-nowrap self-start"
            >
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </div>
  );
};

export default ShareDialog;